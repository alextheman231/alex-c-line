import type { Command } from "commander";

import templatePullRequest from "src/cli/commands/template/pullRequest";
import templateReleaseNote from "src/cli/commands/template/releaseNote";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function template(program: Command) {
  const templateProgram = program
    .command("template")
    .description("Manage the automatically-generatable template files.");

  loadCommands(templateProgram, {
    templatePullRequest,
    templateReleaseNote,
  });
}

export default template;
