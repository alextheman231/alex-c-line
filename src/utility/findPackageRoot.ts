import { DataError } from "@alextheman/utility";

import { readFile } from "node:fs/promises";
import path from "node:path";

async function findPackageRoot(startDirectory: string, packageName: string) {
  let directory = startDirectory;

  while (true) {
    const packagePath = path.join(directory, "package.json");
    try {
      const packageInfo = JSON.parse(await readFile(packagePath, "utf-8"));
      if (packageInfo?.name === packageName) {
        return directory;
      }
    } catch {
      // Ignore error (would occur if package.json not found)
    }

    const parent = path.dirname(directory);
    if (parent === directory) {
      break;
    }
    directory = parent;
  }

  throw new DataError(
    packageName,
    "PACKAGE_ROOT_NOT_FOUND",
    `Could not find package root for ${packageName}`,
  );
}

export default findPackageRoot;
