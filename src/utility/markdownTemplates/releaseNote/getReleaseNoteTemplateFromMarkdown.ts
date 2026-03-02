import type { VersionNumber } from "@alextheman/utility";

import type { ReleaseStatus } from "src/utility/markdownTemplates/releaseNote/types/ReleaseStatus";

import { readFile } from "node:fs/promises";
import path from "node:path";

import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/alexCLinePackageRoot";
import getEditableSectionFromTemplate from "src/utility/markdownTemplates/getEditableSectionFromTemplate";
import replaceMarkdownPlaceholders from "src/utility/markdownTemplates/replaceMarkdownPlaceholders";

interface ReleaseNoteDataBase {
  status?: ReleaseStatus;
}

interface ReleaseNoteDataSpecificEditableSections extends ReleaseNoteDataBase {
  descriptionOfChanges: string;
  migrationNotes?: string;
  additionalNotes?: string;
}

interface ReleaseNoteDataEditableSection extends ReleaseNoteDataBase {
  editableSection?: string;
  descriptionOfChanges?: never;
  migrationNotes?: never;
  additionalNotes?: never;
}

export type ReleaseNoteData =
  | ReleaseNoteDataEditableSection
  | ReleaseNoteDataSpecificEditableSections;

async function getTemplateVariables(
  projectName: string,
  version: VersionNumber,
  templateVariables: ReleaseNoteData,
): Promise<Record<string, string>> {
  if ("editableSection" in templateVariables && templateVariables.editableSection) {
    const { status = "In progress", editableSection } = templateVariables;
    return {
      projectName,
      versionNumber: version.toString(),
      status,
      editableSection,
    };
  }

  const {
    status = "In progress",
    descriptionOfChanges = "Description here",
    migrationNotes = "Migration notes here",
    additionalNotes = "Additional note here",
  } = templateVariables;
  const editableSection = replaceMarkdownPlaceholders(
    await getEditableSectionFromTemplate(version),
    {
      descriptionOfChanges,
      migrationNotes,
      additionalNotes,
    },
  );

  return {
    projectName,
    versionNumber: version.toString(),
    status,
    editableSection,
  };
}

async function getReleaseNoteTemplateFromMarkdown(
  projectName: string,
  version: VersionNumber,
  metadata: ReleaseNoteData,
): Promise<string> {
  const templateVariables = await getTemplateVariables(projectName, version, metadata);
  const templatesPath = path.join(await ALEX_C_LINE_PACKAGE_ROOT, "templates", "releases");

  const filePath = path.join(templatesPath, `${version.type}.md`);

  return replaceMarkdownPlaceholders(await readFile(filePath, "utf-8"), templateVariables);
}

export default getReleaseNoteTemplateFromMarkdown;
