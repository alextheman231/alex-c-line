import type { Command } from "commander";

import budgetExpenseGet from "src/cli/commands/budget/expense/get";
import budgetExpenseSet from "src/cli/commands/budget/expense/set";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function budgetExpense(program: Command) {
  const budgetExpenseProgram = program.command("expense").description("Manage your expenses.");

  loadCommands(budgetExpenseProgram, {
    budgetExpenseGet,
    budgetExpenseSet,
  });
}

export default budgetExpense;
