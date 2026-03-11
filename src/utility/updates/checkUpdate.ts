import type { Command } from "commander";

import { normaliseIndents, VersionNumber } from "@alextheman/utility";
import axios from "axios";
import chalk from "chalk";
import supportsColor from "supports-color";

import centerLine from "src/utility/miscellaneous/centerLine";
import createAlexCLineArtwork from "src/utility/miscellaneous/createAlexCLineArtwork";

import { version } from "package.json" with { type: "json" };

export interface CheckUpdateOptions {
  program?: Command;
  logNoUpdates?: boolean;
  updateLogger?: (message: string) => void;
}

async function checkUpdate(options?: CheckUpdateOptions) {
  const currentVersion = new VersionNumber(version);
  const { data } = await axios.get("https://registry.npmjs.org/alex-c-line/latest", {
    timeout: 5000,
  });
  const latestVersion = new VersionNumber(data.version);

  if (!VersionNumber.isEqual(currentVersion, latestVersion)) {
    const message = normaliseIndents`
              A new update of \`alex-c-line\` is available!
              ${currentVersion.toString()} → ${latestVersion.toString()}
              Run \`npm install -g alex-c-line@latest\` to update.
          `;
    const width = Math.max(
      ...message.split("\n").map((line) => {
        return line.length;
      }),
    );

    const messageWithArtwork = await createAlexCLineArtwork({
      includeColors: Boolean(supportsColor.stdout),
      subtitleColor: chalk.white,
      subtitleText: message
        .split("\n")
        .map((line) => {
          return centerLine(line, width);
        })
        .join("\n"),
    });

    if (options?.program) {
      const { program } = options;
      program.error(messageWithArtwork, {
        exitCode: 2,
        code: "OUTDATED_VERSION",
      });
    } else {
      const { updateLogger = console.info } = options ?? {};
      updateLogger(messageWithArtwork);
    }
  } else if (options?.logNoUpdates) {
    console.info(`alex-c-line is up to date (${currentVersion}).`);
  }
}

export default checkUpdate;
