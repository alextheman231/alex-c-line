import type { Command } from "commander";

import { DataError } from "@alextheman/utility/v6";
import chalk from "chalk";

import createAlexCLineArtwork from "src/utility/miscellaneous/createAlexCLineArtwork";

function artworkLog(program: Command) {
  program
    .command("log")
    .description("Log the alex-c-line artwork to the console.")
    .option("--subtitle-text <subtitleText>", "Customise the subtitle text.")
    .option("--subtitle-color <subtitleColor>", "Customise the subtitle color.")
    .action(async ({ subtitleText, subtitleColor = "green" }) => {
      if (subtitleColor !== "green" && subtitleColor !== "white") {
        throw new DataError(
          { subtitleColor },
          "INVALID_SUBTITLE_COLOR",
          "Subtitle color must either be green or white.",
        );
      }

      const chalkColour = {
        green: chalk.green,
        white: chalk.white,
      }[subtitleColor];
      console.info(
        await createAlexCLineArtwork({
          includeBox: true,
          includeColors: true,
          subtitleText,
          subtitleColor: chalkColour,
        }),
      );
    });
}

export default artworkLog;
