import type { Command } from "commander";

import { az } from "@alextheman/utility";
import z from "zod";

import addExpenses from "src/services/budget/addExpenses";

function budgetExpenseAdd(program: Command) {
  program
    .command("add")
    .description("Add an expense")
    .argument("<name>", "The expense name.")
    .argument("<value>", "The expense value.", (rawValue) => {
      return az.with(z.coerce.number()).parse(rawValue);
    })
    .action(async (name, value) => {
      await addExpenses({ [name]: value });
      console.info(
        `Expense "${name}" of £${value} added. To see all your expenses, run \`alex-c-line budget expense get\`.`,
      );
    });
}

export default budgetExpenseAdd;
