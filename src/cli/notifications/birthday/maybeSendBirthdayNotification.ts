import { isAnniversary } from "@alextheman/utility";

import createAlexCLineGlobalCache from "src/cache/global/createAlexCLineGlobalCache";
import loadAlexCLineGlobalCache from "src/cache/global/loadAlexCLineGlobalCache";
import sendBirthdayNotification from "src/cli/notifications/birthday/sendBirthdayNotification";
import birthdays from "src/cli/notifications/helpers/birthdays";

async function maybeSendBirthdayNotification() {
  try {
    const cacheData = await loadAlexCLineGlobalCache();
    const currentDate = new Date();

    for (const birthday of birthdays) {
      const lastChecked = cacheData?.birthdayChecks?.[birthday.id]
        ? new Date(cacheData.birthdayChecks[birthday.id])
        : undefined;
      if (
        (lastChecked === undefined || lastChecked.getFullYear() !== currentDate.getFullYear()) &&
        isAnniversary(currentDate, birthday.date)
      ) {
        await sendBirthdayNotification(
          birthday.getMessage(currentDate.getFullYear() - birthday.date.getFullYear()),
        );
        await createAlexCLineGlobalCache({
          ...(cacheData ?? {}),
          birthdayChecks: {
            ...(cacheData?.birthdayChecks ?? {}),
            [birthday.id]: currentDate.toISOString(),
          },
        });
      }
    }
  } catch {
    // Swallow any errors that may arise from any step of this process.
    // It would be very bad if we blocked users from running other commands just because the CLI wants to be rude and doesn't want to acknowledge my birthday.
  }
}

export default maybeSendBirthdayNotification;
