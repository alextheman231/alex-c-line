import type { Command } from "commander";

import envFileEdit from "src/cli/commands/env-file/edit";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function envFile(program: Command) {
  const envFileProgram = program.command("env-file").description("Interact with a .env file");

  loadCommands(envFileProgram, {
    envFileEdit,
  });
}

export default envFile;
