import type { Command } from "commander";

import {
  DataError,
  normaliseIndents,
  parseVersionType,
  parseZodSchema,
  VersionNumber,
} from "@alextheman/utility";
import z from "zod";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import getReleaseNoteTemplate from "src/utility/getReleaseNoteTemplate";

function createReleaseNote2(program: Command) {
  program
    .command("create-release-note-2")
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
      const packageInfo = JSON.parse(
        await readFile(path.join(process.cwd(), "package.json"), "utf-8"),
      );

      const { name, version: packageVersion } = parseZodSchema(
        z.object({ name: z.string(), version: z.string() }),
        packageInfo,
        () => {
          program.error(
            "Invalid package.json - expected package.json to contain a `name` and `version` property.",
            { exitCode: 1, code: "INVALID_PACKAGE_JSON" },
          );
        },
      );

      const versionNumber =
        target instanceof VersionNumber
          ? target
          : target
            ? new VersionNumber(packageVersion).increment(target)
            : new VersionNumber(packageVersion);

      const releaseNotePath = path.join(
        process.cwd(),
        "docs",
        "releases",
        `v${versionNumber.major}`,
        `v${versionNumber.major}.${versionNumber.minor}`,
        `${versionNumber}.md`,
      );

      const releaseNoteTemplate = getReleaseNoteTemplate(name, versionNumber, "In progress");

      try {
        await mkdir(path.dirname(releaseNotePath), { recursive: true });
        await writeFile(releaseNotePath, releaseNoteTemplate, { flag: "wx" });
      } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "EEXIST") {
          program.error("❌ ERROR: Release notes already exist.", {
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

export default createReleaseNote2;
