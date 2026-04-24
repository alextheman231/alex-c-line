import type { AlexCLineGlobalCache } from "src/cache/global/types/AlexCLineGlobalCache";

import { az } from "@alextheman/utility";

import { alexCLineGlobalCacheSchema } from "src/cache/global/types/AlexCLineGlobalCache";

function parseAlexCLineGlobalCache(input: unknown): AlexCLineGlobalCache {
  return az.with(alexCLineGlobalCacheSchema).parse(input);
}

export default parseAlexCLineGlobalCache;
