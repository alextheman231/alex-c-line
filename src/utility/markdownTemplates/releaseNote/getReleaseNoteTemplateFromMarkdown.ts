import type { VersionNumber } from "@alextheman/utility";

import type { ReleaseStatus } from "src/utility/markdownTemplates/releaseNote/types/ReleaseStatus";

import { DataError, parseZodSchema } from "@alextheman/utility";
import matter from "gray-matter";
import z from "zod";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import findPackageRoot from "src/utility/fileSystem/findPackageRoot";

interface ReleaseNoteData {
  status?: ReleaseStatus;
  descriptionOfChanges?: string;
  migrationNotes?: string;
  additionalNotes?: string;
}

const __filename = fileURLToPath(import.meta.url);

function getTemplateVariables(
  projectName: string,
  version: VersionNumber,
  templateVariables: ReleaseNoteData,
): Record<string, string> {
  return {
    projectName,
    versionNumber: version.toString(),
    status: templateVariables.status ?? "In progress",
    descriptionOfChanges: templateVariables.descriptionOfChanges ?? "Description here",
    migrationNotes: templateVariables.migrationNotes ?? "Migration notes here",
    additionalNotes: templateVariables.additionalNotes ?? "Additional notes here",
  };
}

async function getReleaseNoteTemplateFromMarkdown(
  projectName: string,
  version: VersionNumber,
  metadata: ReleaseNoteData,
): Promise<string> {
  const templateVariables = getTemplateVariables(projectName, version, metadata);
  const templatesPath = path.join(
    await findPackageRoot(path.dirname(__filename), "alex-c-line"),
    "templates",
    "releases",
  );

  const filePath = path.join(templatesPath, `${version.type}.md`);
  const { content, data } = matter(await readFile(filePath, "utf-8"));

  const placeholders = parseZodSchema(z.array(z.string()).default([]), data.placeholders);

  let finalContent = content;
  for (const placeholder of placeholders) {
    if (!(placeholder in templateVariables)) {
      throw new DataError(
        placeholder,
        "INVALID_PLACEHOLDER",
        "The placeholder found in frontmatter can not be found in the metadata.",
      );
    }

    finalContent = finalContent.replaceAll(`{{${placeholder}}}`, templateVariables[placeholder]);
  }
  return finalContent.trimStart();
}

export default getReleaseNoteTemplateFromMarkdown;
