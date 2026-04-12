import { normaliseIndents } from "@alextheman/utility";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import setDirectory from "tests/helpers/setDirectory";
import alexCLineTestClient from "tests/testClients/alexCLineTestClient";

import errorPrefix from "src/utility/constants/errorPrefix";
import successPrefix from "src/utility/constants/successPrefix";

describe("prefer-exact-dependency-versions", () => {
  test("Succeeds if dependencies are exactly pinned", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      await writeFile(
        path.join(temporaryPath, "pyproject.toml"),
        normaliseIndents`
                [project]
                dependencies = [ 
                    "manim==0.20.1",
                    "freezegun==1.5.2"
                ]
            `,
      );

      const alexCLineTestClientInDirectory = alexCLineTestClient(setDirectory(temporaryPath));

      const { exitCode, stdout } =
        await alexCLineTestClientInDirectory`pyproject check --rules prefer-exact-dependency-versions`;
      expect(exitCode).toBe(0);
      expect(stdout).toContain(successPrefix);
    });
  });
  test("Succeeds if dependencies are exactly pinned in dev dependency group", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      await writeFile(
        path.join(temporaryPath, "pyproject.toml"),
        normaliseIndents`
                [dependency-groups]
                dev = [
                    "black==26.3.1",
                    "isort==8.0.1",
                    "mypy==1.20",
                    "pytest==9.0.3",
                    "ruff==0.15.10",
                ]
            `,
      );

      const alexCLineTestClientInDirectory = alexCLineTestClient(setDirectory(temporaryPath));

      const { exitCode, stdout } =
        await alexCLineTestClientInDirectory`pyproject check --rules prefer-exact-dependency-versions`;
      expect(exitCode).toBe(0);
      expect(stdout).toContain(successPrefix);
    });
  });
  test("Succeeds if both dependencies and dev dependencies are exactly pinned in dev dependency group", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      await writeFile(
        path.join(temporaryPath, "pyproject.toml"),
        normaliseIndents`
                [project]
                dependencies = [ 
                    "manim==0.20.1",
                    "freezegun==1.5.2"
                ]

                [dependency-groups]
                dev = [
                    "black==26.3.1",
                    "isort==8.0.1",
                    "mypy==1.20",
                    "pytest==9.0.3",
                    "ruff==0.15.10",
                ]
            `,
      );

      const alexCLineTestClientInDirectory = alexCLineTestClient(setDirectory(temporaryPath));

      const { exitCode, stdout } =
        await alexCLineTestClientInDirectory`pyproject check --rules prefer-exact-dependency-versions`;
      expect(exitCode).toBe(0);
      expect(stdout).toContain(successPrefix);
    });
  });
  test("Fails if dependencies are not exactly pinned", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      await writeFile(
        path.join(temporaryPath, "pyproject.toml"),
        normaliseIndents`
                [project]
                dependencies = [ 
                    "manim>=0.20.1",
                    "freezegun==1.5.2"
                ]
            `,
      );

      const alexCLineTestClientInDirectory = alexCLineTestClient(setDirectory(temporaryPath));

      const { exitCode, stderr: errorMessage } = await alexCLineTestClientInDirectory({
        reject: false,
      })`pyproject check --rules prefer-exact-dependency-versions`;
      expect(exitCode).toBe(2);
      expect(errorMessage).toContain(errorPrefix);
      expect(errorMessage).toContain("manim>=0.20.1");
    });
  });
  test("Fails if dev dependencies are not exactly pinned", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      await writeFile(
        path.join(temporaryPath, "pyproject.toml"),
        normaliseIndents`
                [dependency-groups]
                dev = [
                    "black>=26.3.1",
                    "isort==8.0.1",
                    "mypy>=1.20",
                    "pytest==9.0.3",
                    "ruff==0.15.10",
                ]
            `,
      );

      const alexCLineTestClientInDirectory = alexCLineTestClient(setDirectory(temporaryPath));

      const { exitCode, stderr: errorMessage } = await alexCLineTestClientInDirectory({
        reject: false,
      })`pyproject check --rules prefer-exact-dependency-versions`;
      expect(exitCode).toBe(2);
      expect(errorMessage).toContain(errorPrefix);
      expect(errorMessage).toContain("black>=26.3.1");
      expect(errorMessage).toContain("mypy>=1.20");
    });
  });
  test("Fails if neither dependency group are exactly pinned", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      await writeFile(
        path.join(temporaryPath, "pyproject.toml"),
        normaliseIndents`
                [project]
                dependencies = [ 
                    "manim>=0.20.1",
                    "freezegun==1.5.2"
                ]

                [dependency-groups]
                dev = [
                    "black>=26.3.1",
                    "isort==8.0.1",
                    "mypy>=1.20",
                    "pytest==9.0.3",
                    "ruff==0.15.10",
                ]
            `,
      );

      const alexCLineTestClientInDirectory = alexCLineTestClient(setDirectory(temporaryPath));

      const { exitCode, stderr: errorMessage } = await alexCLineTestClientInDirectory({
        reject: false,
      })`pyproject check --rules prefer-exact-dependency-versions`;
      expect(exitCode).toBe(2);
      expect(errorMessage).toContain(errorPrefix);
      expect(errorMessage).toContain("manim>=0.20.1");
      expect(errorMessage).toContain("black>=26.3.1");
      expect(errorMessage).toContain("mypy>=1.20");
    });
  });
});
