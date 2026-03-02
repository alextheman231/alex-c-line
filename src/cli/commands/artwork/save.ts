import type { Command } from "commander";

import { DataError } from "@alextheman/utility";

import path from "node:path";

import asciiToPng from "src/utility/miscellaneous/asciiToPng";
import createAlexCLineArtwork from "src/utility/miscellaneous/createAlexCLineArtwork";

function artworkSave(program: Command) {
  program
    .command("save")
    .description("Create the artwork for alex-c-line")
    .option("--subtitle-text <subtitleText>", "Customise the subtitle text")
    .option("--subtitle-color <subtitleColor>", "Customise the subtitle color")
    .option(
      "--file-path <filePath>",
      "Save the artwork as a PNG file, optionally specifying the path",
      "artwork/alex-c-line.png",
    )
    .action(async ({ filePath, subtitleText, subtitleColor = "green" }) => {
      if (subtitleColor !== "green" && subtitleColor !== "white") {
        throw new DataError(
          { subtitleColor },
          "INVALID_SUBTITLE_COLOR",
          "Subtitle color must either be green or white.",
        );
      }

      await asciiToPng(
        await createAlexCLineArtwork({
          includeBox: false,
          includeColors: false,
          subtitleText,
        }),
        {
          filePath,
          fontSize: 90,
          subtitleColor,
          subtitleLineCount: subtitleText?.split("\n").length,
        },
      );
      console.info(
        `Artwork saved successfully to ${path.resolve(filePath.endsWith(".png") ? filePath : `${filePath}.png`)}`,
      );
    });
}

export default artworkSave;
