import type { Command } from "commander";

import removeExpense from "src/services/budget/removeExpense";

function budgetExpenseRemove(program: Command) {
  program
    .command("remove")
    .description("Remove an expense.")
    .argument("<name>", "The name of the expense to remove.")
    .action(async (name) => {
      await removeExpense(name);
      console.info(`Expense "${name}" has been successfully removed.`);
    });
}

export default budgetExpenseRemove;
