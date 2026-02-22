import type { AlexCLineGlobalCache } from "src/cache/global/types/AlexCLineGlobalCache";

import { parseZodSchema } from "@alextheman/utility";

import { alexCLineGlobalCacheSchema } from "src/cache/global/types/AlexCLineGlobalCache";

function parseAlexCLineGlobalCache(input: unknown): AlexCLineGlobalCache {
  return parseZodSchema(alexCLineGlobalCacheSchema, input);
}

export default parseAlexCLineGlobalCache;
