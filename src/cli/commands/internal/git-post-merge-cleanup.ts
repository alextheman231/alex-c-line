import type { Command } from "commander";

import { execa } from "execa";

function gitPostMergeCleanup(program: Command) {
  program
    .command("git-post-merge-cleanup")
    .alias("git-cleanup")
    .description("Run after merging into a given branch to quickly clean up")
    .argument("[branch]", "The branch you want to merge into", "main")
    .option("--rebase", "Enable if your repository mainly rebases into main", true)
    .action(async (branch: string, { rebase }) => {
      console.info(`Running git-post-merge-cleanup in ${rebase ? "rebase" : "merge"} mode...`);

      const { stdout: currentBranch } = await execa`git branch --show-current`;
      if (currentBranch === branch) {
        program.error(`❌ ERROR: Cannot run cleanup on ${branch} branch!`, {
          exitCode: 1,
          code: "INVALID_BRANCH",
        });
      }
      const runCommandAndLogToConsole = execa({
        stdio: "inherit",
      });

      if (rebase) {
        await runCommandAndLogToConsole`git fetch origin ${branch}`;
        await runCommandAndLogToConsole`git pull origin ${branch}`;
      }
      await runCommandAndLogToConsole`git checkout ${branch}`;
      await runCommandAndLogToConsole`git pull origin ${branch}`;
      await runCommandAndLogToConsole`git fetch --prune`;
      if (rebase) {
        const { stdout: changes } = await execa`git diff ${branch}..${currentBranch}`;
        if (changes) {
          await execa`git checkout ${currentBranch}`;
          program.error("❌ ERROR: Changes on branch not fully merged!", {
            exitCode: 1,
            code: "CHANGES_NOT_MERGED",
          });
        }
        await runCommandAndLogToConsole`git branch -D ${currentBranch}`;
      } else {
        /* This is needed so that if the command errors, it doesn't log the error to the console
          and we instead print my own error message. But if it succeeds, we do log the message. */
        const { stdout: branchDeletedMessage, exitCode } = await execa({
          reject: false,
        })`git branch --delete ${currentBranch}`;

        if (exitCode !== 0) {
          await execa`git checkout ${currentBranch}`;
          program.error("❌ ERROR: Changes on branch not fully merged!", {
            exitCode: 1,
            code: "CHANGES_NOT_MERGED",
          });
        }

        console.info(branchDeletedMessage);
      }
    });
}

export default gitPostMergeCleanup;
