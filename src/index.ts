#!/usr/bin/env node
import { parseBoolean } from "@alextheman/utility";
import { Command } from "commander";

import createCommands from "src/commands";
import formatError from "src/utility/errors/formatError";
import runAutomatedUpdateCheck from "src/utility/updates/runAutomatedUpdateCheck";

import packageInfo from "package.json" with { type: "json" };

(async () => {
  try {
    const program = new Command();
    program
      .name(packageInfo.name)
      .description(packageInfo.description)
      .version(packageInfo.version);

    if (
      !(
        process.env.NODE_ENV === "test" ||
        parseBoolean(process.env.RUN_END_TO_END ?? "false") ||
        parseBoolean(process.env.CI ?? "false")
      )
    ) {
      await runAutomatedUpdateCheck();
    }

    createCommands(program);
    await program.parseAsync(process.argv);
  } catch (error) {
    formatError(error);
  }
})();
