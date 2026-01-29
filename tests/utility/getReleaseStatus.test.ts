import { normaliseIndents } from "@alextheman/utility";
import { describe, expect, test } from "vitest";

import { ReleaseStatus } from "src/utility/getReleaseNoteTemplateFromMarkdown";
import getReleaseStatus from "src/utility/getReleaseStatus";

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
