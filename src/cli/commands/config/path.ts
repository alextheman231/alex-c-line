import type { Command } from "commander";

import { ALEX_C_LINE_GLOBAL_CONFIG_PATH } from "src/utility/constants/envPaths";

function configPath(program: Command) {
  program
    .command("path")
    .description("Get the path to the raw alex-c-line config file.")
    .action(() => {
      console.info(ALEX_C_LINE_GLOBAL_CONFIG_PATH);
    });
}

export default configPath;
