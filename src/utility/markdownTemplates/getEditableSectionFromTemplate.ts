import type { VersionNumber } from "@alextheman/utility";

import { readFile } from "node:fs/promises";
import path from "node:path";

import getReleaseNoteTemplatesPath from "src/utility/markdownTemplates/getReleaseNoteTemplatesPath";

async function getEditableSectionFromTemplate(version: VersionNumber): Promise<string> {
  const templatesPath = await getReleaseNoteTemplatesPath();
  return await readFile(
    path.join(
      templatesPath,
      version.type === "major" ? "editableSectionMajor.md" : "editableSection.md",
    ),
    "utf-8",
  );
}

export default getEditableSectionFromTemplate;
