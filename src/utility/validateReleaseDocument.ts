import type { VersionNumber } from "@alextheman/utility";

import type { ReleaseStatus } from "src/utility/getReleaseNoteTemplateFromMarkdown";

import { DataError, kebabToCamel, normaliseIndents, removeDuplicates } from "@alextheman/utility";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import findPackageRoot from "src/utility/findPackageRoot";
import getMarkdownBlock from "src/utility/getMarkdownBlock";
import getReleaseStatus from "src/utility/getReleaseStatus";
import normaliseMarkdown from "src/utility/normaliseMarkdown";

const __filename = fileURLToPath(import.meta.url);

async function validateReleaseDocument(
  projectName: string,
  version: VersionNumber,
  content: string,
  allowedReleaseStatus: ReleaseStatus | ReleaseStatus[] = ["In progress", "Released"],
): Promise<void> {
  if (
    !normaliseMarkdown(content).startsWith(
      normaliseMarkdown(normaliseIndents`
            # ${version} (${kebabToCamel(version.type, { startWithUpper: true })} Release)
            `),
    )
  ) {
    throw new DataError(
      content.split("\n").slice(0, 3).join("\n"),
      "INVALID_HEADING",
      normaliseIndents`
                Expected heading to be:

                # ${version} (${kebabToCamel(version.type, { startWithUpper: true })} Release)
              `,
    );
  }

  const releaseStatus = getReleaseStatus(content);

  const allowedReleaseStatuses = removeDuplicates(
    Array.isArray(allowedReleaseStatus) ? allowedReleaseStatus : [allowedReleaseStatus],
  );

  if (!allowedReleaseStatuses.includes(releaseStatus)) {
    throw new DataError(
      { releaseStatus },
      "INVALID_RELEASE_STATUS",
      `Invalid release status. Received "${releaseStatus}" but expected one of: ${allowedReleaseStatuses.map(
        (status) => {
          return `"${status}"`;
        },
      )}`,
    );
  }

  const summary = getMarkdownBlock(
    content,
    "<!-- alex-c-line-start-release-summary -->",
    "<!-- alex-c-line-end-release-summary -->",
  );

  const templateContent = await readFile(
    path.join(
      await findPackageRoot(path.dirname(__filename), "alex-c-line"),
      "templates",
      "releases",
      `${version.type}.md`,
    ),
    "utf-8",
  );
  const templateSummary = getMarkdownBlock(
    templateContent,
    "<!-- alex-c-line-start-release-summary -->",
    "<!-- alex-c-line-end-release-summary -->",
  )?.replaceAll(`{{projectName}}`, projectName);

  // This should never trigger in practice because I expect all my templates to have summaries, but this is there in case I forget.
  if (!templateSummary) {
    throw new DataError(
      templateContent,
      "SUMMARY_NOT_FOUND",
      "Expected to find a release summary but it was not found.",
    );
  }

  if (!summary) {
    throw new DataError(
      content,
      "SUMMARY_NOT_FOUND",
      normaliseIndents`
      Expected to find a release summary but it was not found. Expected release summary to be:

      ${templateSummary}
      `,
    );
  }

  if (normaliseMarkdown(summary) !== normaliseMarkdown(templateSummary)) {
    throw new DataError(
      summary,
      "INVALID_SUMMARY",
      normaliseIndents`
      Summary does not match what was expected. Expected release summary to be:

      ${templateSummary}
      `,
    );
  }

  if (!content.includes("## Description of Changes")) {
    throw new DataError(
      content,
      "DESCRIPTION_NOT_FOUND",
      "Expected to find a description of changes but it was not found.",
    );
  }

  if (version.type === "major" && !content.includes("## Migration Notes")) {
    throw new DataError(
      content,
      "MIGRATION_NOTES_NOT_FOUND",
      "Major version notes must have migration notes as major versions are expected to be breaking changes that require users to migrate and refactor their code.",
    );
  }
}

export default validateReleaseDocument;
