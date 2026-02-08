import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const require = createRequire(import.meta.url);

import type { AlexCLinePrivateConfig } from "src/configs/types/AlexCLinePrivateConfig";

import { parseAlexCLinePrivateConfig } from "src/configs/helpers/defineAlexCLinePrivateConfig";

async function loadAlexCLinePrivateConfig(filePath: string): Promise<AlexCLinePrivateConfig> {
  if (filePath.endsWith(".cjs")) {
    const module = require(filePath);
    return parseAlexCLinePrivateConfig(module.default ?? module);
  }
  const module = await import(pathToFileURL(filePath).href);
  return parseAlexCLinePrivateConfig(module.default ?? module);
}

export default loadAlexCLinePrivateConfig;
