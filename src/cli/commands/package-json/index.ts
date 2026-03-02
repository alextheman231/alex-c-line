import type { Command } from "commander";

import loadCommands from "src/utility/miscellaneous/loadCommands";

import packageJsonCheck from "src/cli/commands/package-json/check";

function packageJson(program: Command) {
  const packageJsonProgram = program
    .command("package-json")
    .description("Manage the package.json file");

  loadCommands(packageJsonProgram, {
    packageJsonCheck,
  });
}

export default packageJson;
