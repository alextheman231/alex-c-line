import type { Command } from "commander";

import getAlexCLineGlobalConfigPath from "src/services/configs/getAlexCLineGlobalConfigPath";

function configPath(program: Command) {
  program
    .command("path")
    .description("Get the path to the raw alex-c-line config file.")
    .action(async () => {
      console.info(await getAlexCLineGlobalConfigPath());
    });
}

export default configPath;
