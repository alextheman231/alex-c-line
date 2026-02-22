import { ONE_DAY_IN_MILLISECONDS } from "@alextheman/utility";

import createAlexCLineGlobalCache from "src/cache/global/createAlexCLineGlobalCache";
import loadAlexCLineGlobalCache from "src/cache/global/loadAlexCLineGlobalCache";
import checkUpdate from "src/utility/updates/checkUpdate";

import { version } from "package.json" with { type: "json" };

async function runAutomatedUpdateCheck() {
  try {
    const cacheData = await loadAlexCLineGlobalCache();

    const lastChecked = cacheData?.updateChecks?.[version]
      ? new Date(cacheData?.updateChecks?.[version])
      : undefined;
    const currentDate = new Date();

    if (
      lastChecked === undefined ||
      currentDate.getTime() - lastChecked.getTime() >= ONE_DAY_IN_MILLISECONDS
    ) {
      await checkUpdate({ logNoUpdates: false });
      await createAlexCLineGlobalCache({
        ...(cacheData ?? {}),
        updateChecks: {
          ...(cacheData?.updateChecks ?? {}),
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
