import boxen from "boxen";
import chalk from "chalk";
import figlet from "figlet";

import centerLine from "src/utility/miscellaneous/centerLine";

export interface CreateAlexCLineArtworkOptions {
  includeColors?: boolean;
}

async function createAlexCLineArtwork(options?: CreateAlexCLineArtworkOptions) {
  const { includeColors = true } = options ?? {};
  const title = await figlet("alex-c-line");

  const titleWidth = Math.max(
    ...title.split("\n").map((line) => {
      return line.length;
    }),
  );

  const subtitleText = "say my name and I'll assist ✓";
  const subtitle = centerLine(subtitleText, titleWidth);

  const output = includeColors
    ? [chalk.yellow(title), chalk.green(subtitle)].join("\n")
    : [title, subtitle].join("\n");

  return boxen(output, {
    padding: { top: 1, bottom: 1, left: 2, right: 2 },
    borderStyle: "round",
    borderColor: "cyanBright",
  });
}

export default createAlexCLineArtwork;
