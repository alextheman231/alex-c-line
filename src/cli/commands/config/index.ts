import type { Command } from "commander";

import configGet from "src/cli/commands/config/get";
import configPath from "src/cli/commands/config/path";
import configReset from "src/cli/commands/config/reset";
import configSet from "src/cli/commands/config/set";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function config(program: Command) {
  const configProgram = program
    .command("config")
    .description("Configure general settings for alex-c-line on your system.");

  loadCommands(configProgram, {
    configGet,
    configPath,
    configReset,
    configSet,
  });
}

export default config;
