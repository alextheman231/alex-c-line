import type { AlexCLineCache } from "src/utility/cache/parseAlexCLineCache";

import { writeFile } from "node:fs/promises";
import path from "node:path";

async function createAlexCLineCache(cacheContents: AlexCLineCache) {
  const cacheFilePath = path.join(process.cwd(), ".alex-c-line", "cache.json");
  await writeFile(cacheFilePath, JSON.stringify(cacheContents, undefined, 2));
}

export default createAlexCLineCache;
