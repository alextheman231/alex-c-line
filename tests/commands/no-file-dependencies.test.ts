import { getPackageJsonPath } from "@alextheman/utility/internal";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import setDirectory from "tests/helpers/setDirectory";
import createAlexCLineTestClient from "tests/testClients/alexCLineTestClient";

describe("package-json no-file-dependencies", () => {
  test("Exits with exit code 0 if no file dependencies found", async () => {
    await temporaryDirectoryTask(async (temporaryDirectory) => {
      const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryDirectory));
      await writeFile(
        path.join(temporaryDirectory, "package.json"),
        JSON.stringify({
          dependencies: {
            "@alextheman/components": "^3.5.3",
            "@alextheman/utility": "*",
          },
          devDependencies: {
            eslint: "^9.34.0",
          },
        }),
      );

      const { stdout: message, exitCode } =
        await alexCLineTestClient`package-json --rules no-file-dependencies`;
      expect(exitCode).toBe(0);
      expect(message).toContain("Checking for file dependencies...");
      expect(message).toContain("No file dependencies found!");
    });
  });
  describe("devDependencies and/or peerDependencies can be left out", async () => {
    test("Leaving out devDependencies", async () => {
      await temporaryDirectoryTask(async (temporaryDirectory) => {
        const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryDirectory));
        await writeFile(
          path.join(temporaryDirectory, "package.json"),
          JSON.stringify({
            dependencies: {
              "@alextheman/components": "^3.5.3",
              "@alextheman/utility": "*",
            },
          }),
        );

        const { stdout: message, exitCode } =
          await alexCLineTestClient`package-json --rules no-file-dependencies`;
        expect(exitCode).toBe(0);
        expect(message).toContain("Checking for file dependencies...");
        expect(message).toContain("No file dependencies found!");
      });
    });
  });
});
test("Dependencies only", async () => {
  await temporaryDirectoryTask(async (temporaryDirectory) => {
    const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryDirectory));
    await writeFile(
      path.join(temporaryDirectory, "package.json"),
      JSON.stringify({
        dependencies: {
          "@alextheman/components": "^3.5.3",
          "@alextheman/utility": "*",
          react: "^19.1.0",
        },
        devDependencies: {
          eslint: "^9.34.0",
        },
      }),
    );

    const { stdout: message, exitCode } =
      await alexCLineTestClient`package-json --rules no-file-dependencies`;
    expect(exitCode).toBe(0);
    expect(message).toContain("Checking for file dependencies...");
    expect(message).toContain("No file dependencies found!");
  });
});
test("Succeeds if package.json is completely empty", async () => {
  await temporaryDirectoryTask(async (temporaryDirectory) => {
    const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryDirectory));
    await writeFile(getPackageJsonPath(temporaryDirectory), JSON.stringify({}));

    const { stdout: message, exitCode } =
      await alexCLineTestClient`package-json --rules no-file-dependencies`;
    expect(exitCode).toBe(0);
    expect(message).toContain("Checking for file dependencies...");
    expect(message).toContain("No file dependencies found!");
  });
});
test("Exit with exit code 2 if file dependencies found", async () => {
  await temporaryDirectoryTask(async (temporaryDirectory) => {
    const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryDirectory));
    await writeFile(
      getPackageJsonPath(temporaryDirectory),
      JSON.stringify({
        dependencies: {
          "@alextheman/components": "file:../components",
          gitmock: "1.0.0",
          "@alextheman/utility": "^1.16.0",
        },
        devDependencies: {
          "@alextheman/eslint-plugin": "file:../eslint-plugin",
          vitest: "*",
        },
      }),
    );

    const {
      exitCode,
      stdout: message,
      stderr: errorMessage,
    } = await alexCLineTestClient({ reject: false })`package-json --rules no-file-dependencies`;
    expect(exitCode).toBe(2);
    expect(message).toContain("Checking for file dependencies...");
    expect(errorMessage).toContain("ERROR: File dependencies found:");
    expect(errorMessage).toContain(
      JSON.stringify(
        {
          dependencies: { "@alextheman/components": "file:../components" },
          devDependencies: { "@alextheman/eslint-plugin": "file:../eslint-plugin" },
        },
        undefined,
        2,
      ),
    );
  });
});
describe("devDependencies can be left out even if error code is 2", () => {
  test("Leaving out devDependencies on error code 2", async () => {
    await temporaryDirectoryTask(async (temporaryDirectory) => {
      const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryDirectory));
      await writeFile(
        path.join(temporaryDirectory, "package.json"),
        JSON.stringify({
          dependencies: {
            "@alextheman/components": "file:../components",
            "@alextheman/utility": "^1.16.0",
          },
        }),
      );

      const {
        exitCode,
        stdout: message,
        stderr: errorMessage,
      } = await alexCLineTestClient({ reject: false })`package-json --rules no-file-dependencies`;

      expect(exitCode).toBe(2);
      expect(message).toContain("Checking for file dependencies...");
      expect(errorMessage).toContain("ERROR: File dependencies found:");
      expect(errorMessage).toContain(
        JSON.stringify(
          {
            dependencies: { "@alextheman/components": "file:../components" },
          },
          undefined,
          2,
        ),
      );
    });
  });
  test("Dependencies only on error code 2", async () => {
    await temporaryDirectoryTask(async (temporaryDirectory) => {
      const alexCLineTestClient = createAlexCLineTestClient(setDirectory(temporaryDirectory));
      await writeFile(
        path.join(temporaryDirectory, "package.json"),
        JSON.stringify({
          dependencies: {
            "@alextheman/components": "file:../components",
            gitmock: "1.0.0",
            "@alextheman/utility": "^1.16.0",
          },
        }),
      );

      const {
        exitCode,
        stdout: message,
        stderr: errorMessage,
      } = await alexCLineTestClient({ reject: false })`package-json --rules no-file-dependencies`;

      expect(exitCode).toBe(2);
      expect(message).toContain("Checking for file dependencies...");
      expect(errorMessage).toContain("ERROR: File dependencies found:");
      expect(errorMessage).toContain(
        JSON.stringify(
          {
            dependencies: { "@alextheman/components": "file:../components" },
          },
          undefined,
          2,
        ),
      );
    });
  });
});
