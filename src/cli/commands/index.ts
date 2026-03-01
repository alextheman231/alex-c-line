import type { Command } from "commander";

import cache from "src/cli/commands/cache";
import checkVersionNumberChange from "src/cli/commands/deprecated/check-version-number-change";
import createPullRequestTemplates from "src/cli/commands/deprecated/create-pull-request-templates";
import createReleaseNote from "src/cli/commands/deprecated/create-release-note";
import editEnv from "src/cli/commands/deprecated/edit-env";
import preCommit from "src/cli/commands/deprecated/pre-commit";
import setReleaseStatus from "src/cli/commands/deprecated/set-release-status";
import internal from "src/cli/commands/internal";
import root from "src/cli/commands/root";
import createPullRequestTemplate from "src/cli/commands/template/pullRequest/create-pull-request-template-2";
import checkReleaseNote from "src/cli/commands/template/releaseNote/check-release-note";
import createReleaseNote2 from "src/cli/commands/template/releaseNote/create-release-note-2";
import migrateReleaseNotes from "src/cli/commands/template/releaseNote/migrate-release-notes";
import setReleaseStatus2 from "src/cli/commands/template/releaseNote/set-release-status-2";
import update from "src/cli/commands/update";
import uuid from "src/cli/commands/uuid";
import getMajorVersion from "src/cli/commands/versioning/get-major-version";
import getMinorVersion from "src/cli/commands/versioning/get-minor-version";
import getVersionType from "src/cli/commands/versioning/get-version-type";
import incrementVersion from "src/cli/commands/versioning/increment-version";
import loadCommands from "src/utility/miscellaneous/loadCommands";

import packageJson from "src/cli/commands/package-json";

function createCommands(program: Command) {
  loadCommands(program, {
    cache,
    checkReleaseNote,
    checkVersionNumberChange,
    createPullRequestTemplate,
    createPullRequestTemplates,
    createReleaseNote,
    createReleaseNote2,
    editEnv,
    getMajorVersion,
    getMinorVersion,
    getVersionType,
    incrementVersion,
    internal,
    migrateReleaseNotes,
    packageJson,
    preCommit,
    root,
    setReleaseStatus,
    setReleaseStatus2,
    update,
    uuid,
  });
}

export default createCommands;
