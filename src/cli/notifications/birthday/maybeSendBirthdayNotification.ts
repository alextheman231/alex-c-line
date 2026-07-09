import createAlexCLineGlobalCache from "src/cache/global/createAlexCLineGlobalCache";
import loadAlexCLineGlobalCache from "src/cache/global/loadAlexCLineGlobalCache";
import sendBirthdayNotification from "src/cli/notifications/birthday/sendBirthdayNotification";

import { version } from "package.json" with { type: "json" };

async function maybeSendBirthdayNotification() {
  try {
    if (typeof Temporal === "undefined") {
      return;
    }

    const { default: birthdays } = await import("src/cli/notifications/helpers/birthdays");

    const currentDate = Temporal.Now.plainDateISO();
    const cacheData = await loadAlexCLineGlobalCache();

    for (const [birthdayId, birthdayData] of Object.entries(birthdays)) {
      const cacheKey = `${version}_${birthdayId}`;

      const lastChecked = cacheData?.birthdayChecks?.[cacheKey]
        ? Temporal.PlainDate.from(cacheData.birthdayChecks[cacheKey])
        : undefined;
      const thisYearsBirthday = birthdayData.date.with(
        { year: currentDate.year },
        { overflow: "constrain" },
      );
      const { years: age } = birthdayData.date.until(currentDate, { largestUnit: "years" });

      if (
        (lastChecked === undefined || lastChecked.year !== currentDate.year) &&
        thisYearsBirthday.equals(currentDate)
      ) {
        await sendBirthdayNotification(birthdayData.getMessage(age));
        await createAlexCLineGlobalCache({
          ...(cacheData ?? {}),
          birthdayChecks: {
            ...(cacheData?.birthdayChecks ?? {}),
            [cacheKey]: currentDate.toString(),
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
