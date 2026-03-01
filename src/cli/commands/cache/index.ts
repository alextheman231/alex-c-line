import type { Command } from "commander";

import cachePath from "src/cli/commands/cache/path";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function cache(program: Command) {
  const cacheProgram = program
    .command("cache")
    .description("Commands related to the alex-c-line cache");

  loadCommands(cacheProgram, {
    cachePath,
  });
}

export default cache;
