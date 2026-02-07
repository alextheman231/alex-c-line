import type { VersionType } from "@alextheman/utility";

import { kebabToCamel, VersionNumber } from "@alextheman/utility";
import { ExecaError } from "execa";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import setDirectory from "tests/helpers/setDirectory";
import createAlexCLineTestClient from "tests/testClients/alexCLineTestClient";

import { name, version } from "package.json" with { type: "json" };

describe("create-release-note-2", () => {
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

      const { exitCode } = await alexCLineTestClient("create-release-note-2");

      expect(exitCode).toBe(0);
      const fileContents = await readFile(
        path.join(
          temporaryPath,
          "docs",
          "releases",
          `v${versionNumber.major}`,
          `v${versionNumber.major}.${versionNumber.minor}`,
          `${versionNumber}.md`,
        ),
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

      const { exitCode } = await alexCLineTestClient("create-release-note-2");
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

        const { exitCode } = await alexCLineTestClient("create-release-note-2");
        expect(exitCode).toBe(0);
        const fileContents = await readFile(
          path.join(
            temporaryPath,
            "docs",
            "releases",
            `v${versionNumber.major}`,
            `v${versionNumber.major}.${versionNumber.minor}`,
            `${versionNumber}.md`,
          ),
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
        await alexCLineTestClient("create-release-note-2");
      } catch (error) {
        if (error instanceof ExecaError) {
          const { stderr: errorMessage, exitCode } = error;
          expect(exitCode).toBe(1);
          expect(errorMessage).toBe("❌ ERROR: Release notes already exist.");
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

        const { exitCode } = await alexCLineTestClient("create-release-note-2", [versionType]);
        expect(exitCode).toBe(0);
        const fileContents = await readFile(
          path.join(
            temporaryPath,
            "docs",
            "releases",
            `v${incrementedVersion.major}`,
            `v${incrementedVersion.major}.${incrementedVersion.minor}`,
            `${incrementedVersion}.md`,
          ),
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
});
