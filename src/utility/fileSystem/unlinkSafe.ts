import { unlink } from "node:fs/promises";

import isEnoentError from "src/utility/fileSystem/isEnoentError";

async function unlinkSafe(path: string): Promise<boolean> {
  try {
    await unlink(path);
    return true;
  } catch (error) {
    if (isEnoentError(error)) {
      return false;
    }
    throw error;
  }
}

export default unlinkSafe;
