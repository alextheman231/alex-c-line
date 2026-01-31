import type { Command } from "commander";

import checkForFileDependencies from "src/commands/check-for-file-dependencies";
import checkLockfileVersionDiscrepancy from "src/commands/check-lockfile-version-discrepancy";
import checkReleaseNote from "src/commands/check-release-note";
import checkVersionNumberChange from "src/commands/check-version-number-change";
import createPullRequestTemplate from "src/commands/create-pull-request-template-2";
import createPullRequestTemplates from "src/commands/create-pull-request-templates";
import createReleaseNote from "src/commands/create-release-note";
import createReleaseNote2 from "src/commands/create-release-note-2";
import editEnv from "src/commands/edit-env";
import encryptWithKey from "src/commands/encrypt-with-key";
import getMajorVersion from "src/commands/get-major-version";
import getMinorVersion from "src/commands/get-minor-version";
import getVersionType from "src/commands/get-version-type";
import gitPostMergeCleanup from "src/commands/git-post-merge-cleanup";
import incrementVersion from "src/commands/increment-version";
import migrateReleaseNotes from "src/commands/migrate-release-notes";
import preCommit from "src/commands/pre-commit";
import preCommit2 from "src/commands/pre-commit-2";
import sayHello from "src/commands/say-hello";
import setReleaseStatus from "src/commands/set-release-status";
import setReleaseStatus2 from "src/commands/set-release-status-2";
import useLocalPackage from "src/commands/use-local-package";
import loadCommands from "src/utility/loadCommands";

function createCommands(program: Command) {
  loadCommands(program, {
    checkForFileDependencies,
    checkLockfileVersionDiscrepancy,
    checkReleaseNote,
    checkVersionNumberChange,
    createPullRequestTemplate,
    createPullRequestTemplates,
    createReleaseNote,
    createReleaseNote2,
    editEnv,
    encryptWithKey,
    getMajorVersion,
    getMinorVersion,
    getVersionType,
    gitPostMergeCleanup,
    incrementVersion,
    migrateReleaseNotes,
    preCommit,
    preCommit2,
    sayHello,
    setReleaseStatus,
    setReleaseStatus2,
    useLocalPackage,
  });
}

export default createCommands;
