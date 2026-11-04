import type { Command } from "commander";

import budgetCalculate from "src/cli/commands/budget/calculate";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function budget(program: Command) {
  const budgetProgram = program
    .command("budget")
    .description("Commands to help manage your finances.");

  loadCommands(budgetProgram, {
    budgetCalculate,
  });
}

export default budget;
