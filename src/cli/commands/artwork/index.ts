import type { Command } from "commander";

import artworkLog from "src/cli/commands/artwork/log";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function artwork(program: Command) {
  const artworkProgram = program
    .command("artwork")
    .description("Interact with the artwork for alex-c-line");

  loadCommands(artworkProgram, {
    artworkLog,
  });
}

export default artwork;
