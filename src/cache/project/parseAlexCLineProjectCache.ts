import type { AlexCLineProjectCache } from "src/cache/project/types/AlexCLineProjectCache";

import { parseZodSchema } from "@alextheman/utility";

import { alexCLineProjectCacheSchema } from "src/cache/project/types/AlexCLineProjectCache";

function parseAlexCLineProjectCache(data: unknown): AlexCLineProjectCache {
  return parseZodSchema(alexCLineProjectCacheSchema, data);
}

export default parseAlexCLineProjectCache;
