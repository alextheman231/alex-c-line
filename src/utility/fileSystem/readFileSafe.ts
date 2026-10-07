import type { ReadFileOptionsWithStringEncoding } from "node:fs";

import { readFile } from "node:fs/promises";

import isEnoentError from "src/utility/fileSystem/isEnoentError";

async function readFileSafe(
  path: string,
  encoding: ReadFileOptionsWithStringEncoding | BufferEncoding = "utf-8",
): Promise<string | null> {
  try {
    return await readFile(path, encoding);
  } catch (error) {
    if (isEnoentError(error)) {
      return null;
    }
    throw error;
  }
}

export default readFileSafe;
