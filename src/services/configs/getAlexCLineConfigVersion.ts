import { assertNotUndefined, parseIntStrict } from "@alextheman/utility";

import { readdir } from "node:fs/promises";
import path from "node:path";

import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/ALEX_C_LINE_PACKAGE_ROOT";

async function getAlexCLineConfigVersion(migrationPath?: string) {
  const migrationDirectory = await readdir(
    migrationPath ?? path.join(await ALEX_C_LINE_PACKAGE_ROOT, "src", "configs", "migrations"),
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

  return Math.max(...migrationNumbers);
}

export default getAlexCLineConfigVersion;
