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
    program.name("alex-c-line").description("CLI tool built by Alex").version(packageInfo.version);

    const notifier = updateNotifier({ pkg: packageInfo });
    await notifier.fetchInfo();

    if (notifier.update) {
      notifier.notify({
        message: `${await createAlexCLineArtwork({ includeColors: Boolean(supportsColor.stdout) })}
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
