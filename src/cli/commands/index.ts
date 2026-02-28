import type { Command } from "commander";

import artwork from "src/cli/commands/artwork";
import cachePath from "src/cli/commands/cache-path";
import checkForFileDependencies from "src/cli/commands/check-for-file-dependencies";
import checkLockfileVersionDiscrepancy from "src/cli/commands/check-lockfile-version-discrepancy";
import checkVersionNumberChange from "src/cli/commands/deprecated/check-version-number-change";
import createPullRequestTemplates from "src/cli/commands/deprecated/create-pull-request-templates";
import createReleaseNote from "src/cli/commands/deprecated/create-release-note";
import editEnv from "src/cli/commands/deprecated/edit-env";
import preCommit from "src/cli/commands/deprecated/pre-commit";
import setReleaseStatus from "src/cli/commands/deprecated/set-release-status";
import editEnvFile from "src/cli/commands/edit-env-file";
import encryptWithKey from "src/cli/commands/encrypt-with-key";
import gitPostMergeCleanup from "src/cli/commands/git-post-merge-cleanup";
import preCommit2 from "src/cli/commands/pre-commit/pre-commit-2";
import sayHello from "src/cli/commands/say-hello";
import createPullRequestTemplate from "src/cli/commands/template/pullRequest/create-pull-request-template-2";
import checkReleaseNote from "src/cli/commands/template/releaseNote/check-release-note";
import createReleaseNote2 from "src/cli/commands/template/releaseNote/create-release-note-2";
import migrateReleaseNotes from "src/cli/commands/template/releaseNote/migrate-release-notes";
import setReleaseStatus2 from "src/cli/commands/template/releaseNote/set-release-status-2";
import update from "src/cli/commands/update";
import useLocalPackage from "src/cli/commands/use-local-package";
import uuid from "src/cli/commands/uuid";
import getMajorVersion from "src/cli/commands/versioning/get-major-version";
import getMinorVersion from "src/cli/commands/versioning/get-minor-version";
import getVersionType from "src/cli/commands/versioning/get-version-type";
import incrementVersion from "src/cli/commands/versioning/increment-version";
import loadCommands from "src/utility/miscellaneous/loadCommands";

import packageJson from "src/cli/commands/package-json";

function createCommands(program: Command) {
  loadCommands(program, {
    artwork,
    cachePath,
    checkForFileDependencies,
    checkLockfileVersionDiscrepancy,
    checkReleaseNote,
    checkVersionNumberChange,
    createPullRequestTemplate,
    createPullRequestTemplates,
    createReleaseNote,
    createReleaseNote2,
    editEnv,
    editEnvFile,
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
    update,
    useLocalPackage,
    uuid,
    packageJson,
  });
}

export default createCommands;
