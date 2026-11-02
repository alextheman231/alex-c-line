#!/usr/bin/env node
import { Command } from "commander";

import createCommands from "src/cli/commands";
import maybeSendBirthdayNotification from "src/cli/notifications/birthday/maybeSendBirthdayNotification";
import shouldShowNotifications from "src/cli/notifications/shouldShowNotifications";
import { registerUpdateMessagePrinter } from "src/cli/notifications/updates/pendingUpdateMessage";
import runAutomatedUpdateCheck from "src/cli/notifications/updates/runAutomatedUpdateCheck";
import migrate from "src/configs/migrations";
import loadAlexCLineGlobalConfig from "src/services/configs/loadAlexCLineGlobalConfig";
import formatError from "src/utility/errors/formatError";

import packageInfo from "package.json" with { type: "json" };

(async () => {
  try {
    const program = new Command();
    program
      .name(packageInfo.name)
      .description(packageInfo.description)
      .version(packageInfo.version);

    await migrate();

    const globalConfig = await loadAlexCLineGlobalConfig();
    registerUpdateMessagePrinter();

    if (shouldShowNotifications) {
      setTimeout(() => {
        const updateNotificationsEnabled = globalConfig?.enableUpdateNotifications ?? true;
        if (updateNotificationsEnabled) {
          void runAutomatedUpdateCheck();
        }
        void maybeSendBirthdayNotification();
      }, 0);
    }

    createCommands(program);
    await program.parseAsync(process.argv);
  } catch (error) {
    formatError(error);
  }
})();
