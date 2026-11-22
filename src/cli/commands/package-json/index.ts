import type { Command } from "commander";

import packageJsonCheck from "src/cli/commands/package-json/check";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function packageJson(program: Command) {
  const packageJsonProgram = program
    .command("package-json")
    .description("Manage the package.json file");

  loadCommands(packageJsonProgram, {
    packageJsonCheck,
  });
}

export default packageJson;
