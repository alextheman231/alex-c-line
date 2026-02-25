import type { Command } from "commander";

import { DataError } from "@alextheman/utility";
import chalk from "chalk";

import asciiToPng from "src/utility/miscellaneous/asciiToPng";
import createAlexCLineArtwork from "src/utility/miscellaneous/createAlexCLineArtwork";

function artwork(program: Command) {
  program
    .command("artwork")
    .description("Create the artwork for alex-c-line")
    .option("--subtitle-text <subtitleText>", "Customise the subtitle text")
    .option("--subtitle-color <subtitleColor>", "Customise the subtitle color")
    .option(
      "--save-png [fileName]",
      "Save the artwork as a PNG file, optionally specifying the path",
    )
    .action(async ({ savePng: fileName, subtitleText, subtitleColor = "green" }) => {
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

      if (fileName) {
        await asciiToPng(
          await createAlexCLineArtwork({
            includeBox: false,
            includeColors: false,
            subtitleText,
          }),
          {
            fileName: typeof fileName === "string" ? fileName : undefined,
            fontSize: 90,
            subtitleColor,
            subtitleLineCount: subtitleText?.split("\n").length,
          },
        );
      }
    });
}

export default artwork;
