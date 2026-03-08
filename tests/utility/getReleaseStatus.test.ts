import { normaliseIndents } from "@alextheman/utility";
import { describe, expect, test } from "vitest";

import getMarkdownCommentPair from "src/utility/markdownTemplates/getMarkdownCommentPair";
import getReleaseStatus from "src/utility/markdownTemplates/releaseNote/getReleaseStatus";
import { ReleaseStatus } from "src/utility/markdownTemplates/releaseNote/types/ReleaseStatus";

describe("getReleaseStatus", () => {
  const [releaseStatusStart, releaseStatusEnd] = getMarkdownCommentPair(
    "alex-c-line-release-status",
  );
  test.each([
    [
      ReleaseStatus.IN_PROGRESS,
      normaliseIndents`
            ${releaseStatusStart}
            **Status**: In progress
            ${releaseStatusEnd}
        `,
    ],
    [
      ReleaseStatus.RELEASED,
      normaliseIndents`
            ${releaseStatusStart}
            **Status**: Released
            ${releaseStatusEnd}
        `,
    ],
  ])("Returns the current release status when it is %s", (expectedStatus, markdownStatus) => {
    expect(getReleaseStatus(markdownStatus)).toBe(expectedStatus);
  });
});
