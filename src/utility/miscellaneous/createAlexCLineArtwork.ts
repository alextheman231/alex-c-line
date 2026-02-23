import type { ChalkInstance } from "chalk";

import boxen from "boxen";
import chalk from "chalk";
import figlet from "figlet";

import centerLine from "src/utility/miscellaneous/centerLine";

export interface CreateAlexCLineArtworkOptions {
  includeBox?: boolean;
  includeColors?: boolean;
  subtitleColor?: ChalkInstance;
  subtitleText?: string;
}

async function createAlexCLineArtwork(options?: CreateAlexCLineArtworkOptions) {
  const {
    includeBox = true,
    includeColors = true,
    subtitleColor = chalk.green,
    subtitleText = "say my name and I'll assist ✓",
  } = options ?? {};
  const title = await figlet("alex-c-line");

  const titleWidth = Math.max(
    ...title.split("\n").map((line) => {
      return line.length;
    }),
  );

  const subtitle = centerLine(subtitleText, titleWidth);

  const output = includeColors
    ? [chalk.yellow(title), subtitleColor(subtitle)].join("\n")
    : [title, subtitle].join("\n");

  return includeBox
    ? boxen(output, {
        padding: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: "round",
        borderColor: "cyanBright",
      })
    : output;
}

export default createAlexCLineArtwork;
