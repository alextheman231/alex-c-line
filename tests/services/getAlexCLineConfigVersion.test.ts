import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import getAlexCLineConfigVersion from "src/services/configs/getAlexCLineConfigVersion";

describe.skip("getConfigVersion", () => {
  test("Resolves to the maximum numbered TypeScript file", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const numbers = [1, 4, 2, 3];

      for (const number of numbers) {
        await writeFile(path.join(temporaryPath, `${number}.ts`), "");
      }

      expect(await getAlexCLineConfigVersion(temporaryPath)).toBe(4);
    });
  });
  test("Ignores non-numbered files", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const numbers = [1, 2, 4, 5, 3];

      for (const number of numbers) {
        await writeFile(path.join(temporaryPath, `${number}.ts`), "");
      }

      await writeFile(path.join(temporaryPath, "index.ts"), "");

      expect(await getAlexCLineConfigVersion(temporaryPath)).toBe(5);
    });
  });
  test("Ignores non-TypeScript files", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const numbers = [1, 2, 4, 5, 6, 3];

      for (const number of numbers) {
        await writeFile(path.join(temporaryPath, `${number}.ts`), "");
      }

      await writeFile(path.join(temporaryPath, "7.py"), "");

      expect(await getAlexCLineConfigVersion(temporaryPath)).toBe(6);
    });
  });
});
