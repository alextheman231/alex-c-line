import { ONE_DAY_IN_MILLISECONDS } from "@alextheman/utility";
import { getPackageJsonContents } from "@alextheman/utility/internal";

import createAlexCLineGlobalCache from "src/cache/global/createAlexCLineGlobalCache";
import loadAlexCLineGlobalCache from "src/cache/global/loadAlexCLineGlobalCache";
import checkUpdate from "src/cli/notifications/updates/checkUpdate";
import { setPendingUpdateMessage } from "src/cli/notifications/updates/pendingUpdateMessage";
import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/ALEX_C_LINE_PACKAGE_ROOT";

async function runAutomatedUpdateCheck() {
  try {
    const packageInfo = await getPackageJsonContents(await ALEX_C_LINE_PACKAGE_ROOT);
    const { version } = packageInfo;

    const cacheData = await loadAlexCLineGlobalCache();

    const lastChecked = cacheData?.updateChecks?.[version]
      ? new Date(cacheData?.updateChecks?.[version])
      : undefined;
    const currentDate = new Date();

    if (
      lastChecked === undefined ||
      currentDate.getTime() - lastChecked.getTime() >= ONE_DAY_IN_MILLISECONDS
    ) {
      await checkUpdate({ logNoUpdates: false, updateLogger: setPendingUpdateMessage });
      await createAlexCLineGlobalCache({
        ...cacheData,
        updateChecks: {
          ...cacheData?.updateChecks,
          [version]: currentDate.toISOString(),
        },
      });
    }
  } catch {
    // Swallow any errors that may arise from any step of this process.
    // Automated update checks must never block other commands from happening.
  }
}

export default runAutomatedUpdateCheck;
