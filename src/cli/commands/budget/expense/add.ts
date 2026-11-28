import type { Command } from "commander";

import { az } from "@alextheman/utility";

import addExpenses from "src/services/budget/addExpenses";

function budgetExpenseAdd(program: Command) {
  program
    .command("add")
    .description("Add an expense")
    .argument("<name>", "The expense name.")
    .argument("<value>", "The expense value.", (rawValue) => {
      return az
        .with(
          az.decimal().refine((value) => {
            return value.isFinite();
          }),
        )
        .parse(rawValue);
    })
    .action(async (name, value) => {
      await addExpenses({ [name]: value });
      console.info(
        `Expense "${name}" of £${value.toFixed(2)} added. To see all your expenses, run \`alex-c-line budget expense get\`.`,
      );
    });
}

export default budgetExpenseAdd;
