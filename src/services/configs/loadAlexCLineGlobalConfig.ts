import type { AlexCLineGlobalConfig } from "src/configs/helpers/defineAlexCLineGlobalConfig";

import { readFile } from "node:fs/promises";

import { parseAlexCLineGlobalConfig } from "src/configs/helpers/defineAlexCLineGlobalConfig";
import { ALEX_C_LINE_GLOBAL_CONFIG_PATH } from "src/utility/constants/envPaths";

async function loadAlexCLineGlobalConfig(): Promise<AlexCLineGlobalConfig | null> {
  try {
    const result = JSON.parse(await readFile(ALEX_C_LINE_GLOBAL_CONFIG_PATH, "utf-8"));
    return parseAlexCLineGlobalConfig(result);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export default loadAlexCLineGlobalConfig;
