import type { VersionNumber } from "@alextheman/utility";

import path from "node:path";

function getReleaseNotePath(versionNumber: VersionNumber) {
  return path.join(
    "docs",
    "releases",
    versionNumber.format({ omitMinor: true }),
    versionNumber.format({ omitPatch: true }),
    `${versionNumber}.md`,
  );
}

export default getReleaseNotePath;
