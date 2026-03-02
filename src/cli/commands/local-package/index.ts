import type { Command } from "commander";

import localPackageUse from "src/cli/commands/local-package/use";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function localPackage(program: Command) {
  const localPackageProgram = program
    .command("local-package")
    .description("Manage the use of local packages in your JavaScript project.");

  loadCommands(localPackageProgram, {
    localPackageUse,
  });
}

export default localPackage;
