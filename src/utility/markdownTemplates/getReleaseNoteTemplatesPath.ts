import path from "node:path";

import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/ALEX_C_LINE_PACKAGE_ROOT";

async function getReleaseNoteTemplatesPath(): Promise<string> {
  return path.join(await ALEX_C_LINE_PACKAGE_ROOT, "templates", "releases");
}

export default getReleaseNoteTemplatesPath;
