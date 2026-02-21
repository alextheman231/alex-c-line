#!/usr/bin/env node
import { Command } from "commander";
import supportsColor from "supports-color";
import updateNotifier from "update-notifier";

import createCommands from "src/commands";
import formatError from "src/utility/errors/formatError";
import createAlexCLineArtwork from "src/utility/miscellaneous/createAlexCLineArtwork";

import packageInfo from "package.json" with { type: "json" };

(async () => {
  try {
    const program = new Command();
    program
      .name(packageInfo.name)
      .description(packageInfo.description)
      .version(packageInfo.version);

    if (process.env.NODE_ENV !== "test") {
      updateNotifier({ pkg: packageInfo }).notify({
        message: `
  ${await createAlexCLineArtwork({ includeColors: Boolean(supportsColor.stdout) })}
  A new update of \`alex-c-line\` is available!
    {currentVersion} → {latestVersion}
  Run \`{updateCommand}\` to update.
  `,
      });
    }

    createCommands(program);
    await program.parseAsync(process.argv);
  } catch (error) {
    formatError(error);
  }
})();
