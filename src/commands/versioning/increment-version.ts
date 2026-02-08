import type { Command } from "commander";

import { normaliseIndents, parseVersionType, VersionNumber } from "@alextheman/utility";

function incrementVersion(program: Command) {
  program
    .command("increment-version")
    .description("Increments the given input version depending on the given increment type.")
    .argument("<version>", "The version to increment", (rawVersion: string) => {
      return new VersionNumber(rawVersion);
    })
    .argument(
      "<incrementType>",
      normaliseIndents`
            The type of increment. Can be one of the following:

            - "major": Change the major version v1.2.3 → v2.0.0
            - "minor": Change the minor version v1.2.3 → v1.3.0
            - "patch": Change the patch version v1.2.3 → v1.2.4
        `,
      parseVersionType,
    )
    .option("--no-prefix")
    .option(
      "--prefix",
      "Whether to add the `v` prefix from the output version or not (defaults to true).",
    )
    .action((version, incrementType, { prefix }) => {
      console.info(version.increment(incrementType).toString({ omitPrefix: !prefix }));
    });
}

export default incrementVersion;
