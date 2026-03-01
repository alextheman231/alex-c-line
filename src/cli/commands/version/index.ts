import type { Command } from "commander";

import versionFormat from "src/cli/commands/version/format";
import versionIncrement from "src/cli/commands/version/increment";
import versionType from "src/cli/commands/version/type";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function version(program: Command) {
  const versionProgram = program
    .command("version")
    .description("Commands to interact with software version numbers.");

  loadCommands(versionProgram, {
    versionFormat,
    versionIncrement,
    versionType,
  });
}

export default version;
