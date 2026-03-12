import type { Command } from "commander";

import internalMediaGenerate from "src/cli/commands/internal/media/generate";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function internalMedia(program: Command) {
  const internalMediaProgram = program.command("media");

  loadCommands(internalMediaProgram, {
    internalMediaGenerate,
  });
}

export default internalMedia;
