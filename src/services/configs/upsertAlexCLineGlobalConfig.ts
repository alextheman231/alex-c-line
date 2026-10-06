import type { AlexCLineGlobalConfig } from "src/configs/helpers/defineAlexCLineGlobalConfig";

import { writeFile } from "node:fs/promises";

import loadAlexCLineGlobalConfig from "src/services/configs/loadAlexCLineGlobalConfig";
import { ALEX_C_LINE_GLOBAL_CONFIG_PATH } from "src/utility/constants/envPaths";

async function upsertAlexCLineGlobalConfig(
  data: AlexCLineGlobalConfig,
): Promise<AlexCLineGlobalConfig> {
  const existing = await loadAlexCLineGlobalConfig();

  if (existing === null) {
    await writeFile(ALEX_C_LINE_GLOBAL_CONFIG_PATH, JSON.stringify(data));
    return data;
  }
  const newConfig = { ...existing, ...data };
  await writeFile(ALEX_C_LINE_GLOBAL_CONFIG_PATH, JSON.stringify(newConfig));
  return newConfig;
}

export default upsertAlexCLineGlobalConfig;
