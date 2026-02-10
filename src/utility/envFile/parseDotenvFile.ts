import type { DotenvParseOutput } from "dotenv";

import { parse } from "dotenv";

import { readFile } from "node:fs/promises";
import path from "node:path";

async function parseDotenvFile(envFilePath: string): Promise<DotenvParseOutput> {
  try {
    return parse(await readFile(path.join(process.cwd(), envFilePath), "utf-8"));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

export default parseDotenvFile;
