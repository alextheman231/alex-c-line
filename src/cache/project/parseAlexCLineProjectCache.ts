import type { AlexCLineProjectCache } from "src/cache/project/types/AlexCLineProjectCache";

import { az } from "@alextheman/utility";

import { alexCLineProjectCacheSchema } from "src/cache/project/types/AlexCLineProjectCache";

function parseAlexCLineProjectCache(data: unknown): AlexCLineProjectCache {
  return az.with(alexCLineProjectCacheSchema).parse(data);
}

export default parseAlexCLineProjectCache;
