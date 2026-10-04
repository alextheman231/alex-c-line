import type { Command } from "commander";

import cacheClear from "src/cli/commands/cache/clear";
import cachePath from "src/cli/commands/cache/path";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function cache(program: Command) {
  const cacheProgram = program
    .command("cache")
    .description("Commands related to the alex-c-line cache");

  loadCommands(cacheProgram, {
    cacheClear,
    cachePath,
  });
}

export default cache;
