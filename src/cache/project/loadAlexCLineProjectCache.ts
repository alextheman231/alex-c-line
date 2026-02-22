import type { AlexCLineProjectCache } from "src/cache/project/types/AlexCLineProjectCache";

import { readFile } from "node:fs/promises";
import path from "node:path";

import parseAlexCLineProjectCache from "src/cache/project/parseAlexCLineProjectCache";

async function loadAlexCLineProjectCache(
  cachePath: string = path.join(".alex-c-line", "cache.json"),
): Promise<AlexCLineProjectCache | null> {
  const fullCachePath = path.join(process.cwd(), cachePath);
  try {
    return parseAlexCLineProjectCache(JSON.parse(await readFile(fullCachePath, "utf-8")));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export default loadAlexCLineProjectCache;
