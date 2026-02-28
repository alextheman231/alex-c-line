import type { Command } from "commander";

import outdatedDependencies from "src/cli/commands/internal/outdated-dependencies";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function internal(program: Command) {
  const internalProgram = program
    .command("internal")
    .description(
      "Commands meant more for internal use by me and is not recommended for production usage.",
    );

  loadCommands(internalProgram, {
    outdatedDependencies,
  });
}

export default internal;
