import type { Command } from "commander";

import budgetExpenseAdd from "src/cli/commands/budget/expense/add";
import budgetExpenseGet from "src/cli/commands/budget/expense/get";
import budgetExpenseRemove from "src/cli/commands/budget/expense/remove";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function budgetExpense(program: Command) {
  const budgetExpenseProgram = program.command("expense").description("Manage your expenses.");

  loadCommands(budgetExpenseProgram, {
    budgetExpenseAdd,
    budgetExpenseGet,
    budgetExpenseRemove,
  });
}

export default budgetExpense;
