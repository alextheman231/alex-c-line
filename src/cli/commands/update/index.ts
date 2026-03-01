import type { Command } from "commander";

import checkUpdateCommand from "src/cli/commands/update/check";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function update(program: Command) {
  const updateProgram = program
    .command("update")
    .description("Handle updates of the currently installed alex-c-line");

  loadCommands(updateProgram, {
    checkUpdateCommand,
  });
}

export default update;
