import type { PackageManager } from "@alextheman/utility/internal";

import { DataError } from "@alextheman/utility";
import { getExpectedTgzName } from "@alextheman/utility/internal";

import { readdir } from "node:fs/promises";

async function findTgzFile(packagePath: string, packageManager: PackageManager): Promise<string> {
  const packageRootFiles = await readdir(packagePath);

  const tgzFiles = packageRootFiles.filter((fileName) => {
    return fileName.endsWith(".tgz");
  });

  if (tgzFiles.length === 0) {
    throw new DataError({ tgzFiles }, "TGZ_FILE_NOT_FOUND", "Could not find any .tgz files");
  }

  const expectedTgzFileName = await getExpectedTgzName(packagePath, packageManager);

  const amountOfMatchingFiles = tgzFiles.filter((fileName) => {
    return fileName === expectedTgzFileName;
  }).length;

  if (amountOfMatchingFiles === 0) {
    throw new DataError(
      { expectedTgzFileName, amountOfMatchingFiles },
      "EXPECTED_FILE_NOT_FOUND",
      "Could not find a .tgz file with the expected file name.",
    );
  }
  if (amountOfMatchingFiles > 1) {
    throw new DataError(
      { expectedTgzFileName, amountOfMatchingFiles },
      "AMBIGUOUS_RESOLUTION",
      "There are too many .tgz files with the expected file name.",
    );
  }

  return expectedTgzFileName;
}

export default findTgzFile;
