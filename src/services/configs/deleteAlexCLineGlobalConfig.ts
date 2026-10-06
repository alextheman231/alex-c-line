import { unlink } from "node:fs/promises";

import { ALEX_C_LINE_GLOBAL_CONFIG_PATH } from "src/utility/constants/envPaths";

async function deleteAlexCLineGlobalConfig(): Promise<boolean> {
  try {
    await unlink(ALEX_C_LINE_GLOBAL_CONFIG_PATH);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

export default deleteAlexCLineGlobalConfig;
