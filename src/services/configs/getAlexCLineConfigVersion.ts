import { assertNotUndefined, parseIntStrict } from "@alextheman/utility";

import { readdir } from "node:fs/promises";
import path from "node:path";

import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/ALEX_C_LINE_PACKAGE_ROOT";

async function getAlexCLineConfigVersion(migrationPath?: string) {
  // Temporary hardcoding for now - will revert later and provide a more long-term fix.
  return 1;
}

export default getAlexCLineConfigVersion;
