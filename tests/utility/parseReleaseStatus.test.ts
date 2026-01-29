import { describe, expect, test } from "vitest";

import { ReleaseStatus } from "src/utility/getReleaseNoteTemplateFromMarkdown";
import parseReleaseStatus from "src/utility/parseReleaseStatus";

describe("parseReleaseStatus", () => {
  test("Is successful when input is a valid release status", () => {
    expect(parseReleaseStatus("In progress")).toBe(ReleaseStatus.IN_PROGRESS);
    expect(parseReleaseStatus("Released")).toBe(ReleaseStatus.RELEASED);
  });
  test("Allows for the keys to be used instead", () => {
    expect(parseReleaseStatus("IN_PROGRESS")).toBe(ReleaseStatus.IN_PROGRESS);
    expect(parseReleaseStatus("RELEASED")).toBe(ReleaseStatus.RELEASED);
  });
  test("Is case insensitive", () => {
    expect(parseReleaseStatus("iN pROgRESs")).toBe(ReleaseStatus.IN_PROGRESS);
    expect(parseReleaseStatus("iN_pROgRESs")).toBe(ReleaseStatus.IN_PROGRESS);
    expect(parseReleaseStatus("reLEAsEd")).toBe(ReleaseStatus.RELEASED);
  });
});
