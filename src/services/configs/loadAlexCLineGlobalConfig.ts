import type { AlexCLineGlobalConfig } from "src/models/configs/AlexCLineGlobalConfig";

import { parseAlexCLineGlobalConfig } from "src/models/configs/AlexCLineGlobalConfig";
import { ALEX_C_LINE_GLOBAL_CONFIG_PATH } from "src/utility/constants/envPaths";
import readJsonFile from "src/utility/fileSystem/readJsonFile";

async function loadAlexCLineGlobalConfig(): Promise<AlexCLineGlobalConfig | null> {
  const result = await readJsonFile(ALEX_C_LINE_GLOBAL_CONFIG_PATH);
  return result === null ? null : parseAlexCLineGlobalConfig(result);
}

export default loadAlexCLineGlobalConfig;
