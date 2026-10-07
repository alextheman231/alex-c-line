import type { AlexCLineGlobalCache } from "src/cache/global/types/AlexCLineGlobalCache";

import { mkdir, writeFile } from "node:fs/promises";

import {
  ALEX_C_LINE_GLOBAL_CACHE_DIRECTORY,
  ALEX_C_LINE_GLOBAL_CACHE_PATH,
} from "src/utility/constants/envPaths";
import stringifyJSON from "src/utility/miscellaneous/stringifyJSON";

async function createAlexCLineGlobalCache(cacheData: AlexCLineGlobalCache) {
  await mkdir(ALEX_C_LINE_GLOBAL_CACHE_DIRECTORY, { recursive: true });
  await writeFile(ALEX_C_LINE_GLOBAL_CACHE_PATH, stringifyJSON(cacheData));
}

export default createAlexCLineGlobalCache;
