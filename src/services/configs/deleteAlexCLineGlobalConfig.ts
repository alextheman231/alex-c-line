import getAlexCLineGlobalConfigPath from "src/services/configs/getAlexCLineGlobalConfigPath";
import unlinkSafe from "src/utility/fileSystem/unlinkSafe";

async function deleteAlexCLineGlobalConfig(): Promise<boolean> {
  return await unlinkSafe(await getAlexCLineGlobalConfigPath());
}

export default deleteAlexCLineGlobalConfig;
