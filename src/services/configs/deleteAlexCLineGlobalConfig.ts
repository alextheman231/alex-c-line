import { ALEX_C_LINE_GLOBAL_CONFIG_PATH } from "src/utility/constants/envPaths";
import unlinkSafe from "src/utility/fileSystem/unlinkSafe";

async function deleteAlexCLineGlobalConfig(): Promise<boolean> {
  return await unlinkSafe(ALEX_C_LINE_GLOBAL_CONFIG_PATH);
}

export default deleteAlexCLineGlobalConfig;
