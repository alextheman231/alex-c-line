import type { DependencyGroup } from "@alextheman/utility/internal";

import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";

import { writeFile } from "node:fs/promises";
import path from "node:path/posix";

import setDirectory from "tests/helpers/setDirectory";
import alexCLineTestClient from "tests/testClients/alexCLineTestClient";

import errorPrefix from "src/utility/constants/errorPrefix";
import successPrefix from "src/utility/constants/successPrefix";

describe("no-pre-release-dependencies", () => {
  test("Exits with exit code 0 if there are no pre-release versions", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      await writeFile(
        path.join(temporaryPath, "package.json"),
        JSON.stringify(
          {
            dependencies: {
              "@alextheman/utility": "^5.1.0",
            },
            devDependencies: {
              eslint: "^10.0.2",
            },
          },
          null,
          2,
        ),
      );

      const testClient = alexCLineTestClient(setDirectory(temporaryPath));

      const { exitCode, stdout: message } =
        await testClient`package-json no-pre-release-dependencies`;
      expect(exitCode).toBe(0);
      expect(message).toBe(`${successPrefix} No pre-release versions found!`);
    });
  });

  test.each<[DependencyGroup, string]>([
    ["dependencies", "1.2.3-alpha.1"],
    ["devDependencies", "0.21.0-beta.3"],
    ["dependencies", "^1.2.3-alpha.1"],
    ["devDependencies", "^0.21.0-beta.3"],
  ])(
    "Exits with exit code 2 if there are pre-release versions in %s (testing pre-release %s)",
    async (dependencyGroup, preReleaseRange) => {
      await temporaryDirectoryTask(async (temporaryPath) => {
        await writeFile(
          path.join(temporaryPath, "package.json"),
          JSON.stringify(
            {
              dependencies: {
                "@alextheman/utility":
                  dependencyGroup === "dependencies" ? preReleaseRange : "^5.1.0",
              },
              devDependencies: {
                tsdown: dependencyGroup === "devDependencies" ? preReleaseRange : "^10.0.2",
              },
            },
            null,
            2,
          ),
        );

        const testClient = alexCLineTestClient({ ...setDirectory(temporaryPath), reject: false });

        const { exitCode, stderr: errorMessage } =
          await testClient`package-json no-pre-release-dependencies`;
        expect(exitCode).toBe(2);
        expect(errorMessage).toContain(errorPrefix);
        expect(errorMessage).toContain(dependencyGroup);
        expect(errorMessage).toContain(
          dependencyGroup === "dependencies" ? "@alextheman/utility" : "tsdown",
        );
        expect(errorMessage).toContain(preReleaseRange);
      });
    },
  );
});
