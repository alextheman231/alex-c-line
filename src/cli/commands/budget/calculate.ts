import type { Command } from "commander";

import type { BudgetInputs } from "src/services/budget/BudgetInputs";

import { az } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import z from "zod";

import path from "node:path";

import createBudgetCsv from "src/services/budget/createBudgetCsv";
import loadExpenses from "src/services/budget/loadExpenses";
import logBudget from "src/services/budget/logBudget";

function budgetCalculate(program: Command) {
  program
    .command("calculate")
    .description(
      "Calculate how much money you could potentially save given your budget and expenses.",
    )
    .option(
      "-e, --expense <expense>",
      "An additional expense to include.",
      (expense, previous: Record<string, number>) => {
        if (!expense.includes("=")) {
          program.error("Expenses must be provided in the format `name=value`.", {
            exitCode: 2,
            code: "INVALID_FORMAT",
          });
        }

        const parts = expense.split("=");
        if (parts.length !== 2) {
          program.error("There must not be more than one `=` in an expense argument.", {
            exitCode: 2,
            code: "INVALID_FORMAT",
          });
        }

        const [name, value] = parts;

        if (name === "") {
          program.error("The expense name must not be empty.", {
            exitCode: 2,
            code: "INVALID_INPUT",
          });
        }

        const newExpenses: Record<string, number> = {
          ...previous,
          [name]: az.with(z.coerce.number()).parse(value),
        };
        return newExpenses;
      },
      {},
    )
    .option("-s, --salary <salary>", "Your monthly salary.", (rawValue) => {
      return az.with(z.coerce.number()).parse(rawValue);
    })
    .option(
      "-b, --balance-forward <balanceForward>",
      "The total amount brought forward from the previous month; the amount in the bank the day before payday.",
      (rawValue) => {
        return az.with(z.coerce.number()).parse(rawValue);
      },
      0,
    )
    .option(
      "-o, --output <path>",
      "The file path to output the results to. Must be a CSV file for now.",
      (rawValue) => {
        if (path.extname(rawValue) !== ".csv") {
          throw new DataError(
            { filename: rawValue },
            "NOT_A_CSV",
            "The output path must be a CSV file.",
          );
        }

        return rawValue;
      },
    )
    .action(async ({ salary, balanceForward, expense: additionalExpenses, output }) => {
      if (salary === undefined) {
        program.error("Salary must be provided", {
          exitCode: 2,
          code: "SALARY_NOT_FOUND",
        });
      }

      const constantExpenses = (await loadExpenses()) ?? {};
      const allExpenses: Record<string, number> = { ...constantExpenses, ...additionalExpenses };

      const inputs: BudgetInputs = { salary, balanceForward, expenses: allExpenses };

      logBudget(inputs);

      if (output !== undefined) {
        await createBudgetCsv(inputs, output);
      }
    });
}

export default budgetCalculate;
