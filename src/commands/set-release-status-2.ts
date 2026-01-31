import type { Command } from "commander";

import { parseZodSchema, VersionNumber } from "@alextheman/utility";
import z from "zod";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { ReleaseStatus } from "src/utility/getReleaseNoteTemplateFromMarkdown";
import parseReleaseStatus from "src/utility/parseReleaseStatus";
import validateReleaseDocument from "src/utility/validateReleaseDocument";

function setReleaseStatus2(program: Command) {
  program
    .command("set-release-status-2")
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
      const packageInfo = JSON.parse(
        await readFile(path.join(process.cwd(), "package.json"), "utf-8"),
      );

      const { name } = parseZodSchema(z.object({ name: z.string() }), packageInfo, () => {
        program.error(
          "Invalid package.json - expected package.json to contain a `name` property.",
          { exitCode: 1, code: "INVALID_PACKAGE_JSON" },
        );
      });

      if (!documentPath.endsWith("md")) {
        program.error("❌ ERROR: Invalid file path. Path must lead to a .md file.", {
          exitCode: 1,
          code: "INVALID_FILE_PATH",
        });
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

      const newDocument = initialDocument.replace(
        /^\*\*Status\*\*:\s*(.+)$/m,
        `**Status**: ${status}`,
      );

      await writeFile(fullDocumentPath, newDocument);
      console.info(`Setting the status of ${documentPath} to "${status}"`);
    });
}

export default setReleaseStatus2;
