import type { Command } from "commander";

import internalCheckLockfileVersionDiscrepancy from "src/cli/commands/internal/check-lockfile-version-discrepancy";
import internalGitPostMergeCleanup from "src/cli/commands/internal/git-post-merge-cleanup";
import internalMedia from "src/cli/commands/internal/media";
import internalOutdatedDependencies from "src/cli/commands/internal/outdated-dependencies";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function internal(program: Command) {
  const internalProgram = program
    .command("internal")
    .description(
      "Commands meant more for internal use by me and is not recommended for production usage.",
    );

  loadCommands(internalProgram, {
    internalCheckLockfileVersionDiscrepancy,
    internalGitPostMergeCleanup,
    internalMedia,
    internalOutdatedDependencies,
  });
}

export default internal;
