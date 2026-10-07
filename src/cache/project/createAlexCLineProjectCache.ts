import type { AlexCLineProjectCache } from "src/cache/project/types/AlexCLineProjectCache";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import stringifyJSON from "src/utility/miscellaneous/stringifyJSON";

async function createAlexCLineProjectCache(cacheContents: AlexCLineProjectCache) {
  const cacheFilePath = path.join(process.cwd(), ".alex-c-line", "cache.json");
  await mkdir(path.dirname(cacheFilePath), { recursive: true });
  await writeFile(cacheFilePath, stringifyJSON(cacheContents));
}

export default createAlexCLineProjectCache;
