import type { Command } from "commander";

import templateChangeRequestCreate from "src/cli/commands/template/changeRequest/create";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function templateChangeRequest(program: Command) {
  const templateChangeRequestProgram = program
    .command("change-request")
    .description("Manage change request documents.");

  loadCommands(templateChangeRequestProgram, {
    templateChangeRequestCreate,
  });
}

export default templateChangeRequest;
