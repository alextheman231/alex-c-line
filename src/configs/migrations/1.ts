import { cp, writeFile } from "node:fs/promises";
import path from "node:path";

import { ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY } from "src/utility/constants/envPaths";
import doesFileExist from "src/utility/fileSystem/doesFileExist";
import stringifyJSON from "src/utility/miscellaneous/stringifyJSON";

interface GlobalConfigV1 {
  enableUpdateNotifications: boolean;
}

async function migrationOne() {
  if (await doesFileExist(path.join(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY, "config.json"))) {
    await cp(
      path.join(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY, "config.json"),
      path.join(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY, "1.json"),
    );
  } else {
    const defaultConfig: GlobalConfigV1 = {
      enableUpdateNotifications: true,
    };
    await writeFile(
      path.join(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY, "1.json"),
      stringifyJSON(defaultConfig),
    );
  }
}

export default migrationOne;
