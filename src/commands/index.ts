import type { Command } from "commander";

import artwork from "src/commands/artwork";
import checkForFileDependencies from "src/commands/check-for-file-dependencies";
import checkLockfileVersionDiscrepancy from "src/commands/check-lockfile-version-discrepancy";
import checkVersionNumberChange from "src/commands/deprecated/check-version-number-change";
import createPullRequestTemplates from "src/commands/deprecated/create-pull-request-templates";
import createReleaseNote from "src/commands/deprecated/create-release-note";
import editEnv from "src/commands/deprecated/edit-env";
import preCommit from "src/commands/deprecated/pre-commit";
import setReleaseStatus from "src/commands/deprecated/set-release-status";
import encryptWithKey from "src/commands/encrypt-with-key";
import gitPostMergeCleanup from "src/commands/git-post-merge-cleanup";
import preCommit2 from "src/commands/pre-commit-2";
import sayHello from "src/commands/say-hello";
import createPullRequestTemplate from "src/commands/template/pullRequest/create-pull-request-template-2";
import checkReleaseNote from "src/commands/template/releaseNote/check-release-note";
import createReleaseNote2 from "src/commands/template/releaseNote/create-release-note-2";
import migrateReleaseNotes from "src/commands/template/releaseNote/migrate-release-notes";
import setReleaseStatus2 from "src/commands/template/releaseNote/set-release-status-2";
import useLocalPackage from "src/commands/use-local-package";
import getMajorVersion from "src/commands/versioning/get-major-version";
import getMinorVersion from "src/commands/versioning/get-minor-version";
import getVersionType from "src/commands/versioning/get-version-type";
import incrementVersion from "src/commands/versioning/increment-version";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function createCommands(program: Command) {
  loadCommands(program, {
    artwork,
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
