import type { Command } from "commander";

import pyprojectCheck from "src/cli/commands/pyproject/check";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function pyproject(program: Command) {
  const pyprojectProgram = program
    .command("pyproject")
    .description("Manage the pyproject.toml file.");

  loadCommands(pyprojectProgram, {
    pyprojectCheck,
  });
}

export default pyproject;
