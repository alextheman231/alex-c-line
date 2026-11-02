import path from "node:path";

import getAlexCLineConfigVersion from "src/services/configs/getAlexCLineConfigVersion";
import { ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY } from "src/utility/constants/envPaths";

async function getAlexCLineGlobalConfigPath() {
  const currentConfigVersion = await getAlexCLineConfigVersion();

  return path.join(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY, `${currentConfigVersion}.json`);
}

export default getAlexCLineGlobalConfigPath;
