import type { Command } from "commander";

import {
  DataError,
  normaliseIndents,
  parseVersionType,
  parseZodSchema,
  VersionNumber,
} from "@alextheman/utility";
import { getPackageJsonContents } from "@alextheman/utility/internal";
import z from "zod";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import errorPrefix from "src/utility/constants/errorPrefix";
import createReleaseNoteFromTemplates from "src/utility/markdownTemplates/releaseNote/createReleaseNoteFromTemplates";
import getReleaseNotePath from "src/utility/markdownTemplates/releaseNote/getReleaseNotePath";

function templateReleaseNoteCreate(program: Command) {
  program
    .command("create")
    .argument(
      "[createFor]",
      normaliseIndents`
      Decide what version to create a release note for exactly:
        - If the input is a version number (e.g. v1.2.3 or 1.2.3), it will create a release note for the given version number
        - If the input is a version type (i.e. \`"major"\`|\`minor\`|\`patch\`), it will create the next version up from package.json based on that increment type.
        - If there is no input, it defaults to the version as found in package.json.`,
      (rawValue) => {
        try {
          return new VersionNumber(rawValue);
        } catch (error) {
          if (DataError.check(error) && error.code === "INVALID_VERSION") {
            return parseVersionType(rawValue);
          }
          throw error;
        }
      },
    )
    .description("Create release notes based on the current version in package.json.")
    .action(async (target) => {
      const packageInfo = await getPackageJsonContents(process.cwd());

      const { name, version: packageVersion } = parseZodSchema(
        z.object({ name: z.string(), version: z.string() }),
        packageInfo,
      );

      const versionNumber =
        target instanceof VersionNumber
          ? target
          : target
            ? new VersionNumber(packageVersion).increment(target)
            : new VersionNumber(packageVersion);

      const releaseNotePath = getReleaseNotePath(versionNumber);

      const releaseNoteTemplate = await createReleaseNoteFromTemplates(name, versionNumber, {
        status: "In progress",
      });

      try {
        await mkdir(path.dirname(releaseNotePath), { recursive: true });
        await writeFile(releaseNotePath, releaseNoteTemplate, { flag: "wx" });
      } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "EEXIST") {
          program.error(`${errorPrefix} Release notes already exist.`, {
            exitCode: 1,
            code: "RELEASE_NOTE_EXISTS",
          });
        } else {
          throw error;
        }
      }
      console.info(
        `Release notes for ${versionNumber} have been created in ${path.relative(process.cwd(), releaseNotePath)}`,
      );
    });
}

export default templateReleaseNoteCreate;
