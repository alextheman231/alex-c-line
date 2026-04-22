import type { Command } from "commander";

import { parseZodSchema, VersionNumber } from "@alextheman/utility";
import { getPackageJsonContents } from "@alextheman/utility/internal";
import { DataError } from "@alextheman/utility/v6";
import z from "zod";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import getMarkdownBlock from "src/utility/markdownTemplates/getMarkdownBlock";
import getMarkdownCommentPair from "src/utility/markdownTemplates/getMarkdownCommentPair";
import createReleaseNoteFromTemplates from "src/utility/markdownTemplates/releaseNote/createReleaseNoteFromTemplates";
import parseReleaseStatus from "src/utility/markdownTemplates/releaseNote/parseReleaseStatus";
import { ReleaseStatus } from "src/utility/markdownTemplates/releaseNote/types/ReleaseStatus";
import validateReleaseDocument from "src/utility/markdownTemplates/releaseNote/validateReleaseDocument";

function templateReleaseNoteSetStatus(program: Command) {
  program
    .command("set-status")
    .description(
      "Change the release status on a given release document initially generated from the `create-release-note` command.",
    )
    .argument("<documentPath>", "The path to the document")
    .argument(
      "[status]",
      "The status to set the document to",
      parseReleaseStatus,
      ReleaseStatus.RELEASED,
    )
    .action(async (documentPath, status) => {
      const packageInfo = await getPackageJsonContents(process.cwd());

      const { name } = parseZodSchema(
        z.object({ name: z.string() }),
        packageInfo,
        new DataError(
          { name: packageInfo?.name },
          "INVALID_PACKAGE_JSON",
          "Invalid package.json - expected package.json to contain a `name` property.",
        ),
      );

      if (!documentPath.endsWith("md")) {
        throw new DataError(
          { documentPath },
          "INVALID_FILE_PATH",
          "Invalid file path. Path must lead to a .md file.",
        );
      }

      const fileBasename = path
        .basename(documentPath)
        .split(".")
        .filter((part) => {
          return part !== "md";
        })
        .join(".");
      const versionNumber = new VersionNumber(fileBasename);

      const fullDocumentPath = path.join(process.cwd(), documentPath);
      const initialDocument = await readFile(fullDocumentPath, "utf-8");

      await validateReleaseDocument(name, versionNumber, initialDocument);

      const [userEditableSectionStart, userEditableSectionEnd] =
        getMarkdownCommentPair("user-editable-section");
      const editableSection = getMarkdownBlock(
        initialDocument,
        userEditableSectionStart,
        userEditableSectionEnd,
      );

      if (editableSection === null) {
        throw new DataError(
          { startMarker: userEditableSectionStart, endMarker: userEditableSectionEnd },
          "EDITABLE_SECTION_NOT_FOUND",
          "Could not find editable section in the provided document.",
        );
      }

      const newDocument = await createReleaseNoteFromTemplates(name, versionNumber, {
        status,
        editableSection,
      });

      await writeFile(fullDocumentPath, newDocument);
      console.info(`Setting the status of ${documentPath} to "${status}"`);
    });
}

export default templateReleaseNoteSetStatus;
