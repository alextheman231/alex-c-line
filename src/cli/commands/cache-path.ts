import type { Command } from "commander";

import { ALEX_C_LINE_GLOBAL_CACHE_PATH } from "src/cache/global/envPaths";

function cachePath(program: Command) {
  program
    .command("cache-path")
    .description("Log the path to the alex-c-line cache files.")
    .action(() => {
      console.info(ALEX_C_LINE_GLOBAL_CACHE_PATH);
    });
}

export default cachePath;
