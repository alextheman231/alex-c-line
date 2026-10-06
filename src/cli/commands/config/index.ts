import type { Command } from "commander";

import configSet from "src/cli/commands/config/set";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function config(program: Command) {
  const configProgram = program
    .command("config")
    .description("Configure general settings for alex-c-line on your system.");

  loadCommands(configProgram, {
    configSet,
  });
}

export default config;
