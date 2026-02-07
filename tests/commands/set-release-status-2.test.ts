import { kebabToCamel, normaliseIndents, VersionNumber } from "@alextheman/utility";
import { ExecaError } from "execa";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { createAlexCLineTestClientInDirectory } from "tests/testClients/alexCLineTestClient";

import getMarkdownBlock from "src/utility/getMarkdownBlock";
import getReleaseNoteTemplateFromMarkdown from "src/utility/getReleaseNoteTemplateFromMarkdown";
import getReleaseSummary, { getMajorReleaseSummary } from "src/utility/getReleaseSummary";

import { name, version } from "package.json" with { type: "json" };

describe("set-release-status-2", () => {
  test("Takes a file path to a valid release note and sets the status to released", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const alexCLineTestClient = createAlexCLineTestClientInDirectory(temporaryPath);
      const versionNumber = new VersionNumber(version);

      await writeFile(
        path.join(temporaryPath, "package.json"),
        JSON.stringify({
          name,
          version,
        }),
      );

      const { exitCode: createReleaseNoteExitCode } =
        await alexCLineTestClient("create-release-note-2");
      expect(createReleaseNoteExitCode).toBe(0);

      const documentPath = path.join(
        temporaryPath,
        "docs",
        "releases",
        `v${versionNumber.major}`,
        `v${versionNumber.major}.${versionNumber.minor}`,
        `${versionNumber}.md`,
      );

      const fileContentsBeforeWrite = await readFile(documentPath, "utf-8");
      expect(fileContentsBeforeWrite).toContain(versionNumber.toString());
      expect(fileContentsBeforeWrite).toContain("**Status**: In progress");

      const { exitCode: setReleaseStatusExitCode } = await alexCLineTestClient(
        "set-release-status-2",
        [path.relative(temporaryPath, documentPath)],
      );
      expect(setReleaseStatusExitCode).toBe(0);

      const fileContentsAfterWrite = await readFile(documentPath, "utf-8");
      expect(fileContentsAfterWrite).toContain("**Status**: Released");
    });
  });

  test("Only replaces the first occurrence of the status", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const alexCLineTestClient = createAlexCLineTestClientInDirectory(temporaryPath);
      const versionNumber = new VersionNumber(version);

      const versionType = new VersionNumber(version).type;
      const documentPath = path.join(
        "docs",
        "releases",
        `v${versionNumber.major}`,
        `v${versionNumber.major}.${versionNumber.minor}`,
        `${versionNumber}.md`,
      );

      await writeFile(
        path.join(temporaryPath, "package.json"),
        JSON.stringify({
          name,
          version,
        }),
      );

      await mkdir(path.dirname(path.join(temporaryPath, documentPath)), { recursive: true });
      await writeFile(
        path.join(temporaryPath, documentPath),
        await getReleaseNoteTemplateFromMarkdown(name, new VersionNumber(version), {
          status: "In progress",
          descriptionOfChanges: "**Status**: In progress",
        }),
      );

      const { exitCode } = await alexCLineTestClient("set-release-status-2", [documentPath]);
      expect(exitCode).toBe(0);

      const fileContentsAfterWrite = await readFile(
        path.join(temporaryPath, documentPath),
        "utf-8",
      );
      expect(
        fileContentsAfterWrite.startsWith(
          `# v${version} (${kebabToCamel(versionType, { startWithUpper: true })} Release)`,
        ),
      ).toBe(true);
      expect(
        getMarkdownBlock(
          fileContentsAfterWrite,
          "<!-- alex-c-line-start-release-status -->",
          "<!-- alex-c-line-end-release-status -->",
        ),
      );
      expect(fileContentsAfterWrite).toContain("**Status**: In progress");
    });
  });

  test.each([
    ["Completely invalid", "hello"],
    [
      "Has version title but not status",
      normaliseIndents`
            # v${version} (${kebabToCamel(new VersionNumber(version).type, { startWithUpper: true })} Release)
        `,
    ],
    [
      "Has version title and status, but status is not in progress",
      normaliseIndents`
            # v${version} (${kebabToCamel(new VersionNumber(version).type, { startWithUpper: true })} Release)

            **Status**: Invalid
        `,
    ],
    [
      "Has version, title and status, but summary is invalid",
      normaliseIndents`
        # v${version} (${kebabToCamel(new VersionNumber(version).type, { startWithUpper: true })} Release)

        **Status**: In progress

        Invalid summary (is generally automatically generated and should not be edited)
    `,
    ],
    [
      "Has version title, status, and valid summary, but no description of changes",
      normaliseIndents`
        # v${version} (${kebabToCamel(new VersionNumber(version).type, { startWithUpper: true })} Release)

        **Status**: In progress

        ${getReleaseSummary(name, new VersionNumber(version))}
    `,
    ],
    [
      "Has version title, status, valid summary, description of changes, but is a major release and has no migration notes",
      normaliseIndents`
        # v2.0.0 (Major Release)

        **Status**: In progress

        ${getMajorReleaseSummary(name)}

        ## Description of Changes

        These are breaking changes. Figure out how to fix them yourself.
    `,
    ],
  ])("Does not operate on invalid markdown (%s)", async (_: string, documentContents: string) => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const alexCLineTestClient = createAlexCLineTestClientInDirectory(temporaryPath);
      const versionNumber = new VersionNumber(version);
      const documentPath = path.join(
        "docs",
        "releases",
        `v${versionNumber.major}`,
        `v${versionNumber.major}.${versionNumber.minor}`,
        `${versionNumber}.md`,
      );

      await writeFile(
        path.join(temporaryPath, "package.json"),
        JSON.stringify({
          name,
          version,
        }),
      );

      await mkdir(path.dirname(path.join(temporaryPath, documentPath)), { recursive: true });
      await writeFile(path.join(temporaryPath, documentPath), documentContents);

      try {
        await alexCLineTestClient("set-release-status-2", [documentPath]);
        throw new Error("DID_NOT_THROW");
      } catch (error) {
        if (error instanceof ExecaError) {
          const { stderr: errorMessage, exitCode } = error;
          expect(exitCode).toBe(1);
          expect(errorMessage).toContain("DataError");
        } else {
          throw error;
        }
      }
    });
  });
});
