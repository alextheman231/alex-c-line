import type { Command } from "commander";

import { VersionNumber } from "@alextheman/utility";
import { getPackageJsonContents } from "@alextheman/utility/internal";

import getReleaseNotePath from "src/utility/markdownTemplates/releaseNote/getReleaseNotePath";

function templateReleaseNotePath(program: Command) {
  program
    .command("path")
    .description("Get the path to the release note for a given version.")
    .argument(
      "[version]",
      "The version number to get the release note path for (leave blank to default to the current directory's package.json version)",
      (rawVersion) => {
        return new VersionNumber(rawVersion);
      },
    )
    .action(async (version) => {
      if (version === undefined) {
        const packageInfo = await getPackageJsonContents(process.cwd());
        const packageVersion = new VersionNumber(packageInfo.version);
        console.info(getReleaseNotePath(packageVersion));
        return;
      }
      console.info(getReleaseNotePath(version));
    });
}

export default templateReleaseNotePath;
