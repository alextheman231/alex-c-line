import type { AlexCLineCache } from "src/utility/cache/parseAlexCLineCache";

import { readFile } from "node:fs/promises";
import path from "node:path";

import parseAlexCLineCache from "src/utility/cache/parseAlexCLineCache";

async function loadAlexCLineCache(
  cachePath: string = path.join(".alex-c-line", "cache.json"),
): Promise<AlexCLineCache | null> {
  const fullCachePath = path.join(process.cwd(), cachePath);
  try {
    return parseAlexCLineCache(JSON.parse(await readFile(fullCachePath, "utf-8")));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export default loadAlexCLineCache;
