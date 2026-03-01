import type { AlexCLineGlobalCache } from "src/cache/global/types/AlexCLineGlobalCache";

import { mkdir, writeFile } from "node:fs/promises";

import {
  ALEX_C_LINE_GLOBAL_CACHE_DIRECTORY,
  ALEX_C_LINE_GLOBAL_CACHE_PATH,
} from "src/cache/global/envPaths";

async function createAlexCLineGlobalCache(cacheData: AlexCLineGlobalCache) {
  await mkdir(ALEX_C_LINE_GLOBAL_CACHE_DIRECTORY, { recursive: true });
  await writeFile(ALEX_C_LINE_GLOBAL_CACHE_PATH, `${JSON.stringify(cacheData, null, 2)}\n`);
}

export default createAlexCLineGlobalCache;
