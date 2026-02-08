import type { AlexCLineConfig } from "src/configs/types/AlexCLineConfig";

import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const require = createRequire(import.meta.url);

import { parseAlexCLineConfig } from "src/configs/helpers/defineAlexCLineConfig";

async function loadAlexCLineConfig(filePath: string): Promise<AlexCLineConfig> {
  if (filePath.endsWith(".cjs")) {
    const module = require(filePath);
    return await parseAlexCLineConfig(module.default ?? module);
  }
  const module = await import(pathToFileURL(filePath).href);
  return await parseAlexCLineConfig(module.default ?? module);
}

export default loadAlexCLineConfig;
