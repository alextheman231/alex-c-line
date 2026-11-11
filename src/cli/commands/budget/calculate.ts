import type { Command } from "commander";

import type { BudgetInputs } from "src/services/budget/BudgetInputs";

import { az } from "@alextheman/utility";
import z from "zod";

import path from "node:path";

import createBudgetCsv from "src/services/budget/createBudgetCsv";
import loadExpenses from "src/services/budget/loadExpenses";
import logBudget from "src/services/budget/logBudget";
import UserError from "src/utility/errors/UserError";

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
          throw new UserError(
            "INVALID_FORMAT",
            "Expenses must be provided in the format `name=value`.",
          );
        }

        const parts = expense.split("=");
        if (parts.length !== 2) {
          throw new UserError(
            "INVALID_FORMAT",
            "There must not be more than one `=` in an expense argument.",
          );
        }

        const [name, value] = parts;

        if (name === "") {
          throw new UserError("INVALID_INPUT", "The expense name must not be empty.");
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
          throw new UserError("NOT_A_CSV", "The output path must be a CSV file.");
        }

        return rawValue;
      },
    )
    .action(async ({ salary, balanceForward, expense: additionalExpenses, output }) => {
      if (salary === undefined) {
        throw new UserError("SALARY_NOT_FOUND", "Salary must be provided");
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
