// eslint-disable-next-line no-restricted-imports
import type { Dirent } from "node:fs";

import { readdir } from "node:fs/promises";

async function readdirSafe(path: string): Promise<Array<Dirent<string>> | undefined> {
  try {
    return await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOTDIR") {
      return undefined;
    }
    throw error;
  }
}

export default readdirSafe;
