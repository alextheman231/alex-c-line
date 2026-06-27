import { escapeRegexPattern, parseIntStrict } from "@alextheman/utility";

import path from "node:path";

function getNextFileName(directoryContents: Array<string>, newFileName: string): string {
  const extension = path.extname(newFileName);
  const baseName = path.basename(newFileName, extension);

  const fileRegex = new RegExp(
    String.raw`^${escapeRegexPattern(baseName)}(?:_(\d+))?${escapeRegexPattern(extension)}$`,
  );
  const matches = directoryContents
    .map((fileName) => {
      return fileName.match(fileRegex);
    })
    .filter((match) => {
      return match !== null;
    });

  if (matches.length === 0) {
    return newFileName;
  }

  const highestSuffix = Math.max(
    ...matches.map((match) => {
      return match[1] === undefined ? 0 : parseIntStrict(match[1]);
    }),
  );

  return highestSuffix === 0
    ? `${baseName}_1${extension}`
    : `${baseName}_${highestSuffix + 1}${extension}`;
}

export default getNextFileName;
