import type { AlexCLineGlobalCache } from "src/cache/global/types/AlexCLineGlobalCache";

import parseAlexCLineGlobalCache from "src/cache/global/parseAlexCLineGlobalCache";
import { ALEX_C_LINE_GLOBAL_CACHE_PATH } from "src/utility/constants/envPaths";
import readJsonFile from "src/utility/fileSystem/readJsonFile";

async function loadAlexCLineGlobalCache(): Promise<AlexCLineGlobalCache | null> {
  const cache = await readJsonFile(ALEX_C_LINE_GLOBAL_CACHE_PATH);

  return cache === null ? null : parseAlexCLineGlobalCache(cache);
}

export default loadAlexCLineGlobalCache;
