import type { Command } from "commander";

import { normaliseIndents, VersionNumber } from "@alextheman/utility";
import chalk from "chalk";
import { execa } from "execa";
import supportsColor from "supports-color";

import centerLine from "src/utility/miscellaneous/centerLine";
import createAlexCLineArtwork from "src/utility/miscellaneous/createAlexCLineArtwork";

import { version } from "package.json" with { type: "json" };

async function checkUpdate(program?: Command) {
  const currentVersion = new VersionNumber(version);
  const { stdout: npmViewResult } = await execa`npm view alex-c-line version`;
  const latestVersion = new VersionNumber(npmViewResult.trim());

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

    if (program) {
      program.error(messageWithArtwork, {
        exitCode: 2,
        code: "OUTDATED_VERSION",
      });
    } else {
      console.info(messageWithArtwork);
    }
  } else {
    console.info(`alex-c-line is up to date (${currentVersion}).`);
  }
}

export default checkUpdate;
