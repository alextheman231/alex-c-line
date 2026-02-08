import { DataError } from "@alextheman/utility";

import { ReleaseStatus } from "src/utility/markdownTemplates/releaseNote/types/ReleaseStatus";

function parseReleaseStatus(data: unknown): ReleaseStatus {
  const stringifiedData = typeof data === "string" ? data : String(data);
  const normalisedStringifiedData = stringifiedData.toUpperCase().replaceAll(" ", "_");

  if (!Object.keys(ReleaseStatus).includes(normalisedStringifiedData)) {
    new DataError(
      { data },
      "INVALID_RELEASE_STATUS",
      'Invalid release status. The release status must be one of "In progress" or "Released"',
    );
  }

  return ReleaseStatus[normalisedStringifiedData as keyof typeof ReleaseStatus];
}

export default parseReleaseStatus;
