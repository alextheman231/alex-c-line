import { assertNotUndefined, parseIntStrict, range } from "@alextheman/utility";
import { describe, expect, test } from "vitest";

import { readdir } from "node:fs/promises";
import path from "node:path";

import CURRENT_CONFIG_VERSION from "src/configs/migrations/CURRENT_CONFIG_VERSION";
import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/ALEX_C_LINE_PACKAGE_ROOT";

describe("Migrations directory", () => {
  test("The migration files are in numerical order up to the maximum migration file, and the CURRENT_CONFIG_VERSION matches the maximum", async () => {
    const migrationDirectory = await readdir(
      path.join(await ALEX_C_LINE_PACKAGE_ROOT, "src", "configs", "migrations"),
    );

    const migrationNumbers = migrationDirectory
      .map((filename) => {
        const result = /(?<version>\d+)\.ts/.exec(filename);
        if (result === null) {
          return null;
        }

        assertNotUndefined(result.groups);

        const { version } = result.groups;

        return parseIntStrict(version);
      })
      .filter((item) => {
        return item !== null;
      });

    const maxMigration = Math.max(...migrationNumbers);

    expect(migrationNumbers).toEqual(range(1, maxMigration + 1));
    expect(CURRENT_CONFIG_VERSION).toBe(maxMigration);
  });
});
