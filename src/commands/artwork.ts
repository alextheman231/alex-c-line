import type { Command } from "commander";

import chalk from "chalk";

import asciiToPng from "src/utility/miscellaneous/asciiToPng";
import createAlexCLineArtwork from "src/utility/miscellaneous/createAlexCLineArtwork";

function artwork(program: Command) {
  program
    .command("artwork")
    .description("Create the artwork for alex-c-line")
    .option("--subtitle-text <subtitleText>", "Customise the subtitle text")
    .option("--subtitle-color <subtitleColor>", "Customise the subtitle color", (subtitleColor) => {
      return {
        green: chalk.green,
        white: chalk.white,
      }[subtitleColor];
    })
    .option(
      "--save-png [fileName]",
      "Save the artwork as a PNG file, optionally specifying the path",
    )
    .action(async ({ savePng: fileName, subtitleText, subtitleColor }) => {
      console.info(
        await createAlexCLineArtwork({
          includeBox: true,
          includeColors: true,
          subtitleText,
          subtitleColor,
        }),
      );

      if (fileName) {
        await asciiToPng(
          await createAlexCLineArtwork({
            includeBox: false,
            includeColors: false,
            subtitleText,
            subtitleColor,
          }),
          {
            fileName: typeof fileName === "string" ? fileName : undefined,
            fontSize: 90,
          },
        );
      }
    });
}

export default artwork;
