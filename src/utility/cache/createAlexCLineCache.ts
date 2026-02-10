import type { AlexCLineCache } from "src/utility/cache/parseAlexCLineCache";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

async function createAlexCLineCache(cacheContents: AlexCLineCache) {
  const cacheFilePath = path.join(process.cwd(), ".alex-c-line", "cache.json");
  await mkdir(path.dirname(cacheFilePath), { recursive: true });
  await writeFile(cacheFilePath, JSON.stringify(cacheContents, undefined, 2));
}

export default createAlexCLineCache;
