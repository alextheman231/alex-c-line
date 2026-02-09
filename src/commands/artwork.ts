import type { Command } from "commander";

import asciiToPng from "src/utility/miscellaneous/asciiToPng";
import createAlexCLineArtwork from "src/utility/miscellaneous/createAlexCLineArtwork";

function artwork(program: Command) {
  program
    .command("artwork")
    .description("Create the artwork for alex-c-line")
    .option(
      "--save-png [fileName]",
      "Save the artwork as a PNG file, optionally specifying the path",
    )
    .action(async ({ savePng: fileName }) => {
      console.info(await createAlexCLineArtwork({ includeColors: true }));

      if (fileName) {
        await asciiToPng(await createAlexCLineArtwork({ includeColors: false }), {
          fileName: typeof fileName === "string" ? fileName : undefined,
          fontSize: 90,
        });
      }
    });
}

export default artwork;
