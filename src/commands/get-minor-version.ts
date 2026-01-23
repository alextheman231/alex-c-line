import type { Command } from "commander";

import { VersionNumber } from "@alextheman/utility";

function getMinorVersion(program: Command) {
  program
    .command("get-minor-version")
    .description("Get the minor representation of a version number (e.g. v2.1, v3.1 etc...)")
    .argument("<version>", "The version to get the minor representation of", (rawValue) => {
      return new VersionNumber(rawValue);
    })
    .action((version) => {
      console.info(`v${version.major}.${version.minor}`);
    });
}

export default getMinorVersion;
