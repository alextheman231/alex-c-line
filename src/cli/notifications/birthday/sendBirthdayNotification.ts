import chalk from "chalk";
import supportsColor from "supports-color";

import centerLine from "src/utility/miscellaneous/centerLine";
import createAlexCLineArtwork from "src/utility/miscellaneous/createAlexCLineArtwork";

async function sendBirthdayNotification(message: string) {
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

  console.info(messageWithArtwork);
}

export default sendBirthdayNotification;
