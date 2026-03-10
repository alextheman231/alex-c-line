#!/usr/bin/env node
import { Command } from "commander";

import createCommands from "src/cli/commands";
import formatError from "src/utility/errors/formatError";
import runAutomatedUpdateCheck from "src/utility/updates/runAutomatedUpdateCheck";
import shouldRunAutomatedUpdateCheck from "src/utility/updates/shouldRunAutomatedUpdateCheck";

import packageInfo from "package.json" with { type: "json" };

(async () => {
  try {
    const program = new Command();
    program
      .name(packageInfo.name)
      .description(packageInfo.description)
      .version(packageInfo.version);

    if (shouldRunAutomatedUpdateCheck) {
      await runAutomatedUpdateCheck();
    }

    createCommands(program);
    await program.parseAsync(process.argv);
  } catch (error) {
    formatError(error);
  }
})();
