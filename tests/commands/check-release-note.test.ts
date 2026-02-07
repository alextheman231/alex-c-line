import type { VersionType } from "@alextheman/utility";

import { VersionNumber } from "@alextheman/utility";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import { createAlexCLineTestClientInDirectory } from "tests/testClients/alexCLineTestClient";

import getReleaseNotePath from "src/utility/getReleaseNotePath";
import { ReleaseStatus } from "src/utility/getReleaseNoteTemplateFromMarkdown";

import packageInfo from "package.json" with { type: "json" };

describe("check-release-note", () => {
  test.each<VersionType>(["major", "minor", "patch"])(
    "Exit code 0 on valid %s release note",
    async (versionType) => {
      await temporaryDirectoryTask(async (temporaryPath) => {
        await writeFile(path.join(temporaryPath, "package.json"), JSON.stringify(packageInfo));
        const alexCLineTestClient = createAlexCLineTestClientInDirectory(temporaryPath);
        const { exitCode: createReleaseNoteExitCode } = await alexCLineTestClient(
          "create-release-note-2",
          [versionType],
        );
        expect(createReleaseNoteExitCode).toBe(0);

        const versionNumber = new VersionNumber(packageInfo.version).increment(versionType);
        const releaseNotePath = getReleaseNotePath(versionNumber);

        const { exitCode: checkReleaseNoteExitCode } = await alexCLineTestClient(
          "check-release-note",
          [releaseNotePath],
        );
        expect(checkReleaseNoteExitCode).toBe(0);
      });
    },
  );

  test("Exit code 1 on invalid release note", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      await writeFile(path.join(temporaryPath, "package.json"), JSON.stringify(packageInfo));

      const invalidFilePath = path.join(temporaryPath, "v1.2.3.md");
      await writeFile(invalidFilePath, "This is not valid");

      const alexCLineTestClient = createAlexCLineTestClientInDirectory(temporaryPath);

      const { exitCode: checkReleaseNoteExitCode } = await alexCLineTestClient(
        "check-release-note",
        ["v1.2.3.md"],
        { reject: false },
      );
      expect(checkReleaseNoteExitCode).toBe(1);
    });
  });

  test.each<VersionType>(["major", "minor", "patch"])(
    "Exit code 1 on unexpected release status, and exit code 0 on expected release status (when version type is %s)",
    async (versionType) => {
      await temporaryDirectoryTask(async (temporaryPath) => {
        // Write actual package.json contents to directory
        await writeFile(path.join(temporaryPath, "package.json"), JSON.stringify(packageInfo));

        const alexCLineTestClient = createAlexCLineTestClientInDirectory(temporaryPath);

        // Create an actually valid release note using the existing command.
        const { exitCode: createReleaseNoteExitCode } = await alexCLineTestClient(
          "create-release-note-2",
          [versionType],
        );
        expect(createReleaseNoteExitCode).toBe(0);

        // Get the expected version number and path of the release note.
        const versionNumber = new VersionNumber(packageInfo.version).increment(versionType);
        const releaseNotePath = getReleaseNotePath(versionNumber);

        // Verify the release note status is currently 'In progress' and not 'Released'.
        const { exitCode: checkReleaseNoteInProgressBeforeExitCode } = await alexCLineTestClient(
          "check-release-note",
          [releaseNotePath, "--expected-release-status", ReleaseStatus.IN_PROGRESS],
        );
        expect(checkReleaseNoteInProgressBeforeExitCode).toBe(0);
        const { exitCode: checkReleaseNoteReleasedBeforeExitCode } = await alexCLineTestClient(
          "check-release-note",
          [releaseNotePath, "--expected-release-status", ReleaseStatus.RELEASED],
          { reject: false },
        );
        expect(checkReleaseNoteReleasedBeforeExitCode).toBe(1);

        // Release the release note
        const { exitCode: setReleaseStatusExitCode } = await alexCLineTestClient(
          "set-release-status-2",
          [releaseNotePath, ReleaseStatus.RELEASED],
        );
        expect(setReleaseStatusExitCode).toBe(0);

        // Verify the release note status is currently 'Released' and not 'In progress'.
        const { exitCode: checkReleaseNoteReleasedAfterExitCode } = await alexCLineTestClient(
          "check-release-note",
          [releaseNotePath, "--expected-release-status", ReleaseStatus.RELEASED],
        );
        expect(checkReleaseNoteReleasedAfterExitCode).toBe(0);
        const { exitCode: checkReleaseNoteInProgressAfterExitCode } = await alexCLineTestClient(
          "check-release-note",
          [releaseNotePath, "--expected-release-status", ReleaseStatus.IN_PROGRESS],
          { reject: false },
        );
        expect(checkReleaseNoteInProgressAfterExitCode).toBe(1);
      });
    },
  );

  test("Gives a program.error() on invalid rather than a DataError", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      await writeFile(path.join(temporaryPath, "package.json"), JSON.stringify(packageInfo));

      const invalidFilePath = path.join(temporaryPath, "v1.2.3.md");
      await writeFile(invalidFilePath, "This is not valid");

      const alexCLineTestClient = createAlexCLineTestClientInDirectory(temporaryPath);

      const { exitCode: checkReleaseNoteExitCode, stderr: errorMessage } =
        await alexCLineTestClient("check-release-note", ["v1.2.3.md"], { reject: false });
      expect(checkReleaseNoteExitCode).toBe(1);

      expect(errorMessage).not.toContain("DataError");
    });
  });
});
