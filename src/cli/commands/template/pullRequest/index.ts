import type { Command } from "commander";

import templatePullRequestCreate from "src/cli/commands/template/pullRequest/create";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function templatePullRequest(program: Command) {
  const templatePullRequestProgram = program
    .command("pull-request")
    .description("Manage the pull request templates.");

  loadCommands(templatePullRequestProgram, {
    templatePullRequestCreate,
  });
}

export default templatePullRequest;
