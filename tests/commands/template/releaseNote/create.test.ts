import type { VersionType } from "@alextheman/utility";

import type { ReleaseStatus } from "src/utility/markdownTemplates/releaseNote/types/ReleaseStatus";

import { kebabToCamel, VersionNumber } from "@alextheman/utility";
import { getPackageJsonContents } from "@alextheman/utility/internal";
import { ExecaError } from "execa";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import getReleaseSummary from "tests/helpers/getReleaseSummary";
import setDirectory from "tests/helpers/setDirectory";
import createAlexCLineTestClient from "tests/testClients/alexCLineTestClient";

import ERROR_PREFIX from "src/utility/constants/ERROR_PREFIX";
import getMarkdownBlock from "src/utility/markdownTemplates/getMarkdownBlock";
import getMarkdownCommentPair from "src/utility/markdownTemplates/getMarkdownCommentPair";
import getReleaseNotePath from "src/utility/markdownTemplates/releaseNote/getReleaseNotePath";

import { name, version } from "package.json" with { type: "json" };

describe("template release-note create", () => {
  test("The resulting release notes at least has the version number and description of changes", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryPath));
      const versionNumber = new VersionNumber(version);

      await writeFile(
        path.join(temporaryPath, "package.json"),
        JSON.stringify({
          name,
          version,
        }),
      );

      const { exitCode } = await alexCLineTestClient`template release-note create`;

      expect(exitCode).toBe(0);
      const fileContents = await readFile(
        path.join(temporaryPath, getReleaseNotePath(versionNumber)),
        "utf-8",
      );
      expect(fileContents).toContain(versionNumber.toString());
      expect(fileContents).toContain(`## Description of Changes`);
    });
  });
  test("A major version change is contained in docs/releases/vX/vX.Y/vX.Y.Z.md and must have migration notes", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryPath));
      await writeFile(
        path.join(temporaryPath, "package.json"),
        JSON.stringify({
          name,
          version: "v2.0.0",
        }),
      );

      const { exitCode } = await alexCLineTestClient`template release-note create`;
      expect(exitCode).toBe(0);
      const fileContents = await readFile(
        path.join(temporaryPath, "docs", "releases", "v2", "v2.0", "v2.0.0.md"),
        "utf-8",
      );

      expect(fileContents).toContain("# v2.0.0 (Major Release)");
      expect(fileContents).toContain("## Migration Notes");
    });
  });
  test.each<[VersionType, VersionNumber]>([
    ["minor", new VersionNumber([1, 2, 0])],
    ["patch", new VersionNumber([1, 2, 3])],
  ])(
    "A %s version change is contained in docs/releases/vX/vX.Y/vX.Y.Z.md",
    async (_, versionNumber) => {
      await temporaryDirectoryTask(async (temporaryPath) => {
        const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryPath));
        await writeFile(
          path.join(temporaryPath, "package.json"),
          JSON.stringify({
            name,
            version: versionNumber.toString(),
          }),
        );

        const { exitCode } = await alexCLineTestClient`template release-note create`;
        expect(exitCode).toBe(0);
        const fileContents = await readFile(
          path.join(temporaryPath, getReleaseNotePath(versionNumber)),
          "utf-8",
        );

        expect(fileContents).toContain(
          `# ${versionNumber} (${kebabToCamel(versionNumber.type, { startWithUpper: true })} Release)`,
        );
      });
    },
  );
  test("Errors if the release note already exists", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryPath));
      await writeFile(
        path.join(temporaryPath, "package.json"),
        JSON.stringify({
          name,
          version: "v1.2.3",
        }),
      );

      try {
        await alexCLineTestClient`template release-note create`;
      } catch (error) {
        if (error instanceof ExecaError) {
          const { stderr: errorMessage, exitCode } = error;
          expect(exitCode).toBe(1);
          expect(errorMessage).toBe(`${ERROR_PREFIX} Release notes already exist.`);
        }
      }
    });
  });
  test.each<VersionType>(["major", "minor", "patch"])(
    "Allows an option for %s to be passed in as an argument",
    async (versionType) => {
      await temporaryDirectoryTask(async (temporaryPath) => {
        const version = new VersionNumber([1, 2, 3]);
        const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryPath));
        await writeFile(
          path.join(temporaryPath, "package.json"),
          JSON.stringify({
            name,
            version,
          }),
        );
        const incrementedVersion = version.increment(versionType);

        const { exitCode } = await alexCLineTestClient`template release-note create ${versionType}`;
        expect(exitCode).toBe(0);
        const fileContents = await readFile(
          path.join(temporaryPath, getReleaseNotePath(incrementedVersion)),
          "utf-8",
        );

        expect(fileContents).toContain(
          `# ${incrementedVersion} (${kebabToCamel(incrementedVersion.type, { startWithUpper: true })} Release)`,
        );
        if (versionType === "major") {
          expect(fileContents).toContain("## Migration Notes");
        }
      });
    },
  );
  test("Can set the content through the CLI", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryPath));
      await writeFile(
        path.join(temporaryPath, "package.json"),
        JSON.stringify({
          name,
          version,
        }),
      );
      const versionNumber = new VersionNumber(version);
      const content = "- Test release";
      const { exitCode } =
        await alexCLineTestClient`template release-note create ${versionNumber.toString()} --content ${content}`;

      expect(exitCode).toBe(0);
      const fileContents = await readFile(
        path.join(temporaryPath, getReleaseNotePath(versionNumber)),
        "utf-8",
      );

      expect(fileContents).toContain(getReleaseSummary(name, versionNumber));
      expect(fileContents).toContain("## Description of Changes");
      expect(fileContents).toContain(content);
    });
  });
  test.each<ReleaseStatus>(["In progress", "Released"])(
    "Sets the release note status to %s when --status flag is provided with that value",
    async (status) => {
      await temporaryDirectoryTask(async (temporaryPath) => {
        const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryPath));
        await writeFile(
          path.join(temporaryPath, "package.json"),
          JSON.stringify({
            name,
            version,
          }),
        );

        const versionNumber = new VersionNumber(version);

        const { exitCode } =
          await alexCLineTestClient`template release-note create ${versionNumber.toString()} --status ${status}`;
        expect(exitCode).toBe(0);

        const content = await readFile(
          path.join(temporaryPath, getReleaseNotePath(versionNumber)),
          "utf-8",
        );
        const statusPart = getMarkdownBlock(
          content,
          ...getMarkdownCommentPair("alex-c-line-release-status"),
        );
        expect(statusPart).toBe(`**Status**: ${status}`);
      });
    },
  );
  test.each<VersionType>(["major", "minor", "patch"])(
    "Changes the package.json version if `--update-version` flag specified (testing %s releases)",
    async (versionType) => {
      await temporaryDirectoryTask(async (temporaryPath) => {
        const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryPath));
        await writeFile(
          path.join(temporaryPath, "package.json"),
          JSON.stringify({
            name,
            version,
          }),
        );
        const oldVersionNumber = new VersionNumber(version);
        const expectedVersionNumber = oldVersionNumber.increment(versionType);
        const { exitCode } =
          await alexCLineTestClient`template release-note create ${versionType} --update-version`;
        expect(exitCode).toBe(0);

        const newPackageInfo = await getPackageJsonContents(temporaryPath);
        const newVersionNumber = new VersionNumber(newPackageInfo.version);
        expect(newVersionNumber.toString()).toBe(expectedVersionNumber.toString());
      });
    },
  );
});
