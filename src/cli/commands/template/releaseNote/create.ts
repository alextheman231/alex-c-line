import type { Command } from "commander";

import { az, normaliseIndents, parseVersionType, VersionNumber } from "@alextheman/utility";
import { getPackageJsonContents } from "@alextheman/utility/internal";
import { DataError } from "@alextheman/utility/v6";
import z from "zod";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import ERROR_PREFIX from "src/utility/constants/ERROR_PREFIX";
import createReleaseNoteFromTemplates from "src/utility/markdownTemplates/releaseNote/createReleaseNoteFromTemplates";
import getReleaseNotePath from "src/utility/markdownTemplates/releaseNote/getReleaseNotePath";
import parseReleaseStatus from "src/utility/markdownTemplates/releaseNote/parseReleaseStatus";
import { ReleaseStatus } from "src/utility/markdownTemplates/releaseNote/types/ReleaseStatus";

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
          if (
            DataError.check<Record<PropertyKey, unknown>, "INVALID_VERSION">(error) &&
            error.code === "INVALID_VERSION"
          ) {
            return parseVersionType(rawValue);
          }
          throw error;
        }
      },
    )
    .option("--content <content>", "Set the content of the release note")
    .option(
      "--status <status>",
      "Set the initial release note status",
      parseReleaseStatus,
      ReleaseStatus.IN_PROGRESS,
    )
    .option(
      "--update-version",
      "Update the version in package.json alongside creating the release note.",
      false,
    )
    .description("Create release notes based on the current version in package.json.")
    .action(async (target, { content, status, updateVersion }) => {
      const packageInfo = await getPackageJsonContents(process.cwd());

      const { name, version: packageVersion } = az
        .with(z.object({ name: z.string(), version: z.string() }))
        .parse(packageInfo);

      const versionNumber =
        target instanceof VersionNumber
          ? target
          : target
            ? new VersionNumber(packageVersion).increment(target)
            : new VersionNumber(packageVersion);

      const releaseNotePath = getReleaseNotePath(versionNumber);

      const releaseNoteTemplate = await createReleaseNoteFromTemplates(name, versionNumber, {
        status,
        editableSection: content,
      });

      try {
        await mkdir(path.dirname(releaseNotePath), { recursive: true });
        await writeFile(releaseNotePath, releaseNoteTemplate, { flag: "wx" });
        console.info(
          `Release notes for ${versionNumber} have been created in ${path.relative(process.cwd(), releaseNotePath)}`,
        );
      } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "EEXIST") {
          program.error(`${ERROR_PREFIX} Release notes already exist.`, {
            exitCode: 1,
            code: "RELEASE_NOTE_EXISTS",
          });
        } else {
          throw error;
        }
      }

      if (updateVersion) {
        const newPackageInfo = { ...packageInfo };
        newPackageInfo.version = versionNumber.format({ omitPrefix: true });
        await writeFile(
          path.join(process.cwd(), "package.json"),
          `${JSON.stringify(newPackageInfo, null, 2)}\n`,
        );
        console.info(`Updated the version in package.json to ${versionNumber}`);
      }
    });
}

export default templateReleaseNoteCreate;
