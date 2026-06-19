import { describe, expect, test } from "vitest";

import isValidLicense from "src/utility/licenses/isValidLicense";

describe("isValidLicense", () => {
  test("Returns true if the license is in allowlist", () => {
    expect(isValidLicense("MIT", ["MIT", "ISC"])).toBe(true);
  });
  test("Returns false if the license is not in allowlist", () => {
    expect(isValidLicense("Unknown", ["MIT", "ISC"])).toBe(false);
  });
  test("Returns true if license resolves to be one in allowlist", () => {
    expect(isValidLicense("(MIT OR Unlicense)", ["MIT", "ISC"])).toBe(true);
  });
  test("Returns false if license does not resolve to be one in allowlist", () => {
    expect(isValidLicense("(MPL-2.0 OR Unlicense)", ["MIT", "ISC"])).toBe(false);
  });
});
