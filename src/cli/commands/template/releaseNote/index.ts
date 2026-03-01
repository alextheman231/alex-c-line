import type { Command } from "commander";

import templateReleaseNoteCheck from "src/cli/commands/template/releaseNote/check";
import templateReleaseNoteCreate from "src/cli/commands/template/releaseNote/create";
import templateReleaseNoteMigrate from "src/cli/commands/template/releaseNote/migrate";
import templateReleaseNoteSetStatus from "src/cli/commands/template/releaseNote/set-status";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function templateReleaseNote(program: Command) {
  const templateReleaseNoteProgram = program
    .command("release-note")
    .description("Manage the release notes");

  loadCommands(templateReleaseNoteProgram, {
    templateReleaseNoteCheck,
    templateReleaseNoteCreate,
    templateReleaseNoteMigrate,
    templateReleaseNoteSetStatus,
  });
}

export default templateReleaseNote;
