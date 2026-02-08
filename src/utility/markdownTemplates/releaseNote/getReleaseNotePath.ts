import type { VersionNumber } from "@alextheman/utility";

import path from "node:path";

function getReleaseNotePath(versionNumber: VersionNumber) {
  return path.join(
    "docs",
    "releases",
    `v${versionNumber.major}`,
    `v${versionNumber.major}.${versionNumber.minor}`,
    `${versionNumber}.md`,
  );
}

export default getReleaseNotePath;
