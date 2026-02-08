import type { VersionType } from "@alextheman/utility";

import { parseZodSchema, VersionNumber } from "@alextheman/utility";
import { execa, ExecaError } from "execa";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";
import z from "zod";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import setDirectory from "tests/helpers/setDirectory";
import alexCLineTestClient from "tests/testClients/alexCLineTestClient";

import getPackageJsonContents from "src/utility/fileSystem/getPackageJsonContents";

import packageInfo, { version } from "package.json" with { type: "json" };

describe("incrementVersion", () => {
  test.each<VersionType>(["major", "minor", "patch"])(
    "Provides the incremented %s version in stdout",
    async (versionType) => {
      const { exitCode, stdout: newVersion } =
        await alexCLineTestClient`increment-version ${version} ${versionType}`;
      expect(exitCode).toBe(0);
      expect(newVersion).toBe(new VersionNumber(version).increment(versionType).toString());
    },
  );

  test("Fails on invalid version number", async () => {
    try {
      await alexCLineTestClient`increment-version hello minor`;
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
      await alexCLineTestClient`increment-version ${version} hello`;
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
    const { exitCode, stdout: newVersion } =
      await alexCLineTestClient`increment-version ${version} major --no-prefix`;
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
            return new VersionNumber(rawValue.trim());
          }),
        });

        await writeFile(path.join(temporaryPath, "package.json"), JSON.stringify(packageInfo));

        const execaInDirectory = execa({ cwd: temporaryPath });
        await execaInDirectory`git init`;
        await execaInDirectory`git config user.email ${"alex-up-bot@bot.com"}`;
        await execaInDirectory`git config user.name ${"alex-up-bot"}`;
        await execaInDirectory`git add .`;
        await execaInDirectory`git commit -m ${"Initial commit"}`;

        const alexCLineInDirectory = alexCLineTestClient(setDirectory(temporaryPath));
        const { version } = parseZodSchema(
          z.object({
            version: z.string().transform((rawValue) => {
              return new VersionNumber(rawValue.trim());
            }),
          }),
          await getPackageJsonContents(temporaryPath),
        );

        const { exitCode: alexCLineExitCode, stdout: newAlexCLineVersion } = parseZodSchema(
          stdoutSchema,
          await alexCLineInDirectory`increment-version ${version.toString()} ${versionType}`,
        );
        expect(alexCLineExitCode).toBe(0);
        const { exitCode: npmExitCode, stdout: newNpmVersion } = parseZodSchema(
          stdoutSchema,
          await execaInDirectory`npm version ${versionType} --no-git-tag-version`,
        );
        expect(npmExitCode).toBe(0);

        expect(
          VersionNumber.isEqual(newAlexCLineVersion, newNpmVersion),
          JSON.stringify({ versionType, newAlexCLineVersion, newNpmVersion }, null, 2),
        ).toBe(true);
      });
    },
  );
});
