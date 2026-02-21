import type { Command } from "commander";

import { DataError, parseZodSchema, VersionNumber } from "@alextheman/utility";
import { getPackageJsonContents } from "@alextheman/utility/internal";
import { parseFilePath } from "@alextheman/utility/node";
import z from "zod";

import { readFile } from "node:fs/promises";
import path from "node:path";

import parseReleaseStatus from "src/utility/markdownTemplates/releaseNote/parseReleaseStatus";
import validateReleaseDocument from "src/utility/markdownTemplates/releaseNote/validateReleaseDocument";

function checkReleaseNote(program: Command) {
  program
    .command("check-release-note")
    .argument("<documentPath>", "The path to the document", parseFilePath)
    .option(
      "--expected-release-status <expectedReleaseStatus>",
      "The expected release status of the document once we read it in.",
      parseReleaseStatus,
    )
    .description(
      "Check whether a given release note is valid according to the templates or not. Returns exit code 0 for valid release note and non-zero otherwise.",
    )
    .action(async (documentPath, { expectedReleaseStatus }) => {
      const fileContents = await readFile(path.join(process.cwd(), documentPath.fullPath), "utf-8");

      const { name } = parseZodSchema(
        z.object({ name: z.string() }),
        await getPackageJsonContents(process.cwd()),
        () => {
          program.error("Your package.json is invalid");
        },
      );

      const documentVersion = new VersionNumber(
        documentPath.base
          .split(".")
          .filter((part) => {
            return part !== "md";
          })
          .join("."),
      );

      try {
        await validateReleaseDocument(name, documentVersion, fileContents, expectedReleaseStatus);
        console.info("Release document is valid!");
      } catch (error) {
        if (DataError.check(error)) {
          program.error(`❌ ERROR: ${error.message}`, { exitCode: 1, code: error.code });
        } else {
          throw error;
        }
      }
    });
}

export default checkReleaseNote;
