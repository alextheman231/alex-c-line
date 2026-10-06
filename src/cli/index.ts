#!/usr/bin/env node
import type { AlexCLineGlobalConfig } from "src/configs/helpers/defineAlexCLineGlobalConfig";

import { Command } from "commander";

import createCommands from "src/cli/commands";
import maybeSendBirthdayNotification from "src/cli/notifications/birthday/maybeSendBirthdayNotification";
import shouldShowNotifications from "src/cli/notifications/shouldShowNotifications";
import { registerUpdateMessagePrinter } from "src/cli/notifications/updates/pendingUpdateMessage";
import runAutomatedUpdateCheck from "src/cli/notifications/updates/runAutomatedUpdateCheck";
import loadAlexCLineGlobalConfig from "src/services/configs/loadAlexCLineGlobalConfig";
import upsertAlexCLineGlobalConfig from "src/services/configs/upsertAlexCLineGlobalConfig";
import formatError from "src/utility/errors/formatError";

import packageInfo from "package.json" with { type: "json" };

async function initialiseGlobalConfig(): Promise<AlexCLineGlobalConfig> {
  const globalConfig = await loadAlexCLineGlobalConfig();

  if (globalConfig === null) {
    return await upsertAlexCLineGlobalConfig({});
  }

  return globalConfig;
}

(async () => {
  try {
    const program = new Command();
    program
      .name(packageInfo.name)
      .description(packageInfo.description)
      .version(packageInfo.version);

    const globalConfig = await initialiseGlobalConfig();
    registerUpdateMessagePrinter();

    if (shouldShowNotifications) {
      setTimeout(() => {
        if (globalConfig.enableUpdateNotifications) {
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
