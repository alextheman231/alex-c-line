import type { Command } from "commander";

import { unlink } from "node:fs/promises";

import { ALEX_C_LINE_GLOBAL_CACHE_PATH } from "src/utility/constants/envPaths";

function cacheClear(program: Command) {
  program
    .command("clear")
    .description("Clear the alex-c-line cache.")
    .action(async () => {
      try {
        await unlink(ALEX_C_LINE_GLOBAL_CACHE_PATH);
        console.info(`Cache from ${ALEX_C_LINE_GLOBAL_CACHE_PATH} removed successfully.`);
      } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
          console.info("Cache already empty.");
        } else {
          throw error;
        }
      }
    });
}

export default cacheClear;
