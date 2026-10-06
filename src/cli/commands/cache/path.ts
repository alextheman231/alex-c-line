import type { Command } from "commander";

import { ALEX_C_LINE_GLOBAL_CACHE_PATH } from "src/utility/constants/envPaths";

function cachePath(program: Command) {
  program
    .command("path")
    .description("Log the path to the alex-c-line cache files.")
    .action(() => {
      console.info(ALEX_C_LINE_GLOBAL_CACHE_PATH);
    });
}

export default cachePath;
