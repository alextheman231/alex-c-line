import type { PrivateConfigFileName } from "src/configs/types/ConfigFileName";

import path from "node:path";

import { ConfigFileName } from "src/configs/types/ConfigFileName";
import doesFileExist from "src/utility/doesFileExist";

async function findAlexCLineConfig(
  cwd: string,
  validConfigFileNames: (ConfigFileName | PrivateConfigFileName)[] = [
    ConfigFileName.ES_MODULES_JAVASCRIPT,
    ConfigFileName.STANDARD_JAVASCRIPT,
    ConfigFileName.COMMON_JS_JAVASCRIPT,
  ],
): Promise<string | undefined> {
  for (const fileName of validConfigFileNames) {
    const fullPath = path.join(cwd, fileName);
    if (await doesFileExist(fullPath)) {
      return fullPath;
    }
  }
  return undefined;
}

export default findAlexCLineConfig;
