// eslint-disable-next-line no-restricted-imports -- The type comes from `node:fs`, not `node:fs/promises` so we need to import it from there.
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
