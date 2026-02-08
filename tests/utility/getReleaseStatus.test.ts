import { normaliseIndents } from "@alextheman/utility";
import { describe, expect, test } from "vitest";

import getReleaseStatus from "src/utility/markdownTemplates/releaseNote/getReleaseStatus";
import { ReleaseStatus } from "src/utility/markdownTemplates/releaseNote/types/ReleaseStatus";

describe("getReleaseStatus", () => {
  test.each([
    [
      ReleaseStatus.IN_PROGRESS,
      normaliseIndents`
            <!-- alex-c-line-start-release-status -->
            **Status**: In progress
            <!-- alex-c-line-end-release-status -->
        `,
    ],
    [
      ReleaseStatus.RELEASED,
      normaliseIndents`
            <!-- alex-c-line-start-release-status -->
            **Status**: Released
            <!-- alex-c-line-end-release-status -->
        `,
    ],
  ])("Returns the current release status when it is %s", (expectedStatus, markdownStatus) => {
    expect(getReleaseStatus(markdownStatus)).toBe(expectedStatus);
  });
});
