import type { Command } from "commander";

import { omitProperties, VersionNumber } from "@alextheman/utility";
import z from "zod";

import parseZodSchemaForProgram from "src/utility/miscellaneous/parseZodSchemaForProgram";

const versionFormatOptionsBaseSchema = z.object({
  prefix: z.boolean().optional(),
});

const versionFormatOptionsNoMinorSchema = versionFormatOptionsBaseSchema.extend({
  minor: z.literal(false),
  patch: z.never().optional(),
});

const versionFormatOptionsMinorSchema = versionFormatOptionsBaseSchema.extend({
  minor: z.literal(true),
  patch: z.boolean().optional(),
});

const versionFormatOptionsSchema = z.discriminatedUnion("minor", [
  versionFormatOptionsNoMinorSchema,
  versionFormatOptionsMinorSchema,
]);

function versionFormat(program: Command) {
  program
    .command("format")
    .description("Format the given version number based on a series of options.")
    .argument("<version>", "The version to format", (rawVersion) => {
      return new VersionNumber(rawVersion);
    })
    .option("--no-prefix", "Omit the `v` prefix from the output.")
    .option("--prefix")
    .option(
      "--no-minor",
      "Omit the minor version number from the output (will also omit the patch version)",
    )
    .option("--minor")
    .option("--no-patch", "Omit the patch version number from the output.")
    .option("--patch")
    .action((version, options) => {
      const { prefix, minor, patch } = parseZodSchemaForProgram(
        program,
        versionFormatOptionsSchema,
        options.minor === false ? omitProperties(options, "patch") : options,
      );
      // @ts-expect-error: The discriminated union is accounted for at runtime with the Zod schema.
      console.info(version.format({ omitPrefix: !prefix, omitMinor: !minor, omitPatch: !patch }));
    });
}

export default versionFormat;
