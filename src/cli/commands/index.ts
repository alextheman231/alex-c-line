import type { Command } from "commander";

import artwork from "src/cli/commands/artwork";
import cache from "src/cli/commands/cache";
import envFile from "src/cli/commands/env-file";
import internal from "src/cli/commands/internal";
import localPackage from "src/cli/commands/local-package";
import root from "src/cli/commands/root";
import template from "src/cli/commands/template";
import update from "src/cli/commands/update";
import uuid from "src/cli/commands/uuid";
import version from "src/cli/commands/version";
import loadCommands from "src/utility/miscellaneous/loadCommands";

import packageJson from "src/cli/commands/package-json";

function createCommands(program: Command) {
  loadCommands(program, {
    artwork,
    cache,
    envFile,
    internal,
    localPackage,
    packageJson,
    root,
    template,
    update,
    uuid,
    version,
  });
}

export default createCommands;
