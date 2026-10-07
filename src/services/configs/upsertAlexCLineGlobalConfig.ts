import type { AlexCLineGlobalConfig } from "src/configs/helpers/defineAlexCLineGlobalConfig";

import { mkdir, writeFile } from "node:fs/promises";

import { parseAlexCLineGlobalConfig } from "src/configs/helpers/defineAlexCLineGlobalConfig";
import DEFAULT_GLOBAL_CONFIG from "src/services/configs/DEFAULT_GLOBAL_CONFIG";
import loadAlexCLineGlobalConfig from "src/services/configs/loadAlexCLineGlobalConfig";
import {
  ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY,
  ALEX_C_LINE_GLOBAL_CONFIG_PATH,
} from "src/utility/constants/envPaths";
import stringifyJSON from "src/utility/miscellaneous/stringifyJSON";

async function upsertAlexCLineGlobalConfig(
  data: Partial<AlexCLineGlobalConfig>,
): Promise<AlexCLineGlobalConfig> {
  const existing = await loadAlexCLineGlobalConfig();

  if (existing === null) {
    const newConfig = parseAlexCLineGlobalConfig({ ...DEFAULT_GLOBAL_CONFIG, ...data });
    await mkdir(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY, { recursive: true });
    await writeFile(ALEX_C_LINE_GLOBAL_CONFIG_PATH, stringifyJSON(newConfig));
    return newConfig;
  }
  const newConfig = parseAlexCLineGlobalConfig({ ...existing, ...data });
  await mkdir(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY, { recursive: true });
  await writeFile(ALEX_C_LINE_GLOBAL_CONFIG_PATH, stringifyJSON(newConfig));
  return newConfig;
}

export default upsertAlexCLineGlobalConfig;
