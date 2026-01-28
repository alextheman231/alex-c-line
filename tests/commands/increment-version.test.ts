import type { VersionType } from "@alextheman/utility";

import { parseZodSchema, VersionNumber } from "@alextheman/utility";
import { execa, ExecaError } from "execa";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";
import z from "zod";

import path from "node:path";

import alexCLineTestClient, {
  createAlexCLineTestClientInDirectory,
} from "tests/test-clients/alex-c-line-test-client";

import getPackageJsonContents from "src/utility/getPackageJsonContents";

import { version } from "package.json" with { type: "json" };

describe("incrementVersion", () => {
  describe("Provides the incremented version in stdout", () => {
    test("Major", async () => {
      const { exitCode: majorExitCode, stdout: newMajorVersion } = await alexCLineTestClient(
        "increment-version",
        [version, "major"],
      );
      expect(majorExitCode).toBe(0);
      expect(newMajorVersion).toBe(new VersionNumber(version).increment("major").toString());
    });

    test("Minor", async () => {
      const { exitCode: minorExitCode, stdout: newMinorVersion } = await alexCLineTestClient(
        "increment-version",
        [version, "minor"],
      );
      expect(minorExitCode).toBe(0);
      expect(newMinorVersion).toBe(new VersionNumber(version).increment("minor").toString());
    });

    test("Patch", async () => {
      const { exitCode: patchExitCode, stdout: newPatchVersion } = await alexCLineTestClient(
        "increment-version",
        [version, "patch"],
      );
      expect(patchExitCode).toBe(0);
      expect(newPatchVersion).toBe(new VersionNumber(version).increment("patch").toString());
    });
  });

  test("Fails on invalid version number", async () => {
    try {
      await alexCLineTestClient("increment-version", ["hello", "minor"]);
    } catch (error) {
      if (error instanceof ExecaError) {
        const { stderr, exitCode } = error;
        expect(exitCode).toBe(1);
        expect(stderr).toContain("DataError");
      } else {
        throw error;
      }
    }
  });

  test("Fails on invalid version type", async () => {
    try {
      await alexCLineTestClient("increment-version", [version, "hello"]);
    } catch (error) {
      if (error instanceof ExecaError) {
        const { stderr, exitCode } = error;
        expect(exitCode).toBe(1);
        expect(stderr).toContain("DataError");
      } else {
        throw error;
      }
    }
  });

  test('Does not include "v" prefix if --no-prefix provided', async () => {
    const { exitCode, stdout: newVersion } = await alexCLineTestClient("increment-version", [
      version,
      "major",
      "--no-prefix",
    ]);
    expect(exitCode).toBe(0);
    expect(newVersion).toBe(
      new VersionNumber(version).increment("major").toString({ omitPrefix: true }),
    );
  });

  test.each<VersionType>(["major", "minor", "patch"])(
    "Resolves to the same result as `npm version %s`",
    async (versionType) => {
      await temporaryDirectoryTask(async (temporaryPath) => {
        const stdoutSchema = z.object({
          exitCode: z.int(),
          stdout: z.string().transform((rawValue) => {
            return new VersionNumber(rawValue);
          }),
        });

        // lol this is cursed
        await execa({ cwd: temporaryPath })`git clone https://github.com/alextheman231/alex-c-line`;
        const repositoryPath = path.join(temporaryPath, "alex-c-line");

        const execaInDirectory = execa({ cwd: repositoryPath });
        const alexCLineTestClient = createAlexCLineTestClientInDirectory(repositoryPath);
        const { version } = parseZodSchema(
          z.object({
            version: z.string().transform((rawValue) => {
              return new VersionNumber(rawValue);
            }),
          }),
          await getPackageJsonContents(repositoryPath),
        );

        const { exitCode: alexCLineExitCode, stdout: newAlexCLineVersion } = parseZodSchema(
          stdoutSchema,
          await alexCLineTestClient("increment-version", [version.toString(), versionType]),
        );
        expect(alexCLineExitCode).toBe(0);
        const { exitCode: npmExitCode, stdout: newNpmVersion } = parseZodSchema(
          stdoutSchema,
          await execaInDirectory`npm version ${versionType} --no-git-tag-version`,
        );
        expect(npmExitCode).toBe(0);

        expect(VersionNumber.isEqual(newAlexCLineVersion, newNpmVersion)).toBe(true);
      });
    },
  );
});
