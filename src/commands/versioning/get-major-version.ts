import type { Command } from "commander";

import { VersionNumber } from "@alextheman/utility";

function getMajorVersion(program: Command) {
  program
    .command("get-major-version")
    .description("Get the major representation of a version number (e.g. v2, v3 etc...)")
    .argument("<version>", "The version to get the major representation of", (rawValue) => {
      return new VersionNumber(rawValue);
    })
    .action((version) => {
      console.info(`v${version.major}`);
    });
}

export default getMajorVersion;
