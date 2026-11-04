import type { VersionNumber } from "@alextheman/utility";

import path from "node:path";

function getReleaseNotePath(versionNumber: VersionNumber) {
  return path.join(
    "docs",
    "releases",
    versionNumber.format({ omitMinor: true, omitPrefix: false }),
    versionNumber.format({ omitPatch: true, omitPrefix: false }),
    `${versionNumber.format({ omitPrefix: false })}.md`,
  );
}

export default getReleaseNotePath;
