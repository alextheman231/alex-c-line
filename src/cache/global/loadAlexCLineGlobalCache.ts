import type { AlexCLineGlobalCache } from "src/cache/global/types/AlexCLineGlobalCache";

import { readFile } from "node:fs/promises";

import { ALEX_C_LINE_GLOBAL_CACHE_PATH } from "src/cache/global/envPaths";
import parseAlexCLineGlobalCache from "src/cache/global/parseAlexCLineGlobalCache";

async function loadAlexCLineGlobalCache(): Promise<AlexCLineGlobalCache | null> {
  try {
    return parseAlexCLineGlobalCache(
      JSON.parse(await readFile(ALEX_C_LINE_GLOBAL_CACHE_PATH, "utf-8")),
    );
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export default loadAlexCLineGlobalCache;
