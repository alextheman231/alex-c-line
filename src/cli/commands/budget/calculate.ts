import type { Command } from "commander";

import { az, normaliseIndents } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import z from "zod";

import path from "node:path";

import calculateSavings from "src/services/budget/calculateSavings";
import loadExpenses from "src/services/budget/loadExpenses";

function budgetCalculate(program: Command) {
  program
    .command("calculate")
    .description(
      "Calculate how much money you could potentially save given your budget and expenses.",
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
      "-o, --output",
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
    .action(async ({ salary, balanceForward }) => {
      if (salary === undefined) {
        program.error("Salary must be provided", {
          exitCode: 2,
          code: "SALARY_NOT_FOUND",
        });
      }

      const constantExpenses = (await loadExpenses()) ?? {};

      const totalSaving = calculateSavings(
        salary + balanceForward,
        Object.values(constantExpenses),
      );

      console.info(normaliseIndents`
                Salary: £${salary}
                Balance forward: £${balanceForward}
                Expenses:
                    ${Object.entries(constantExpenses)
                      .map(([name, value]) => {
                        return `${name}: ${value}`;
                      })
                      .join("\n")}
                Total saving: ${totalSaving}
            `);
    });
}

export default budgetCalculate;
