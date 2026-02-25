import type { Command } from "commander";

import generateUUID from "src/cli/commands/uuid/generate";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function uuid(program: Command) {
  const uuidProgram = program.command("uuid").description("Commands to help manage UUIDs");

  loadCommands(uuidProgram, {
    generateUUID,
  });
}

export default uuid;
