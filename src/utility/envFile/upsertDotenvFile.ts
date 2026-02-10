import { stringifyDotenv } from "@alextheman/utility";

import { writeFile } from "node:fs/promises";
import path from "node:path";

async function upsertDotenvFile(
  contents: Record<string, string>,
  envFilePath: string,
): Promise<void> {
  await writeFile(path.join(process.cwd(), envFilePath), stringifyDotenv(contents));
}

export default upsertDotenvFile;
