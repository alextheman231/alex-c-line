import { describe, expect, test } from "vitest";

import resolveLicense from "src/utility/licenses/resolveLicense";

describe("resolveLicense", () => {
  test("Leaves alone licenses that are already a license", () => {
    expect(resolveLicense("MIT")).toEqual(["MIT"]);
  });
  test("Resolves licenses that are part of an SPDX expression", () => {
    expect(resolveLicense("(MIT OR ISC)")).toEqual(["MIT", "ISC"]);
  });
  test("Brackets in SPDX are optional", () => {
    expect(resolveLicense("MIT OR ISC")).toEqual(["MIT", "ISC"]);
  });
  test("Resolves licenses containing more than two licenses in an SPDX expression", () => {
    expect(resolveLicense("(MIT OR Apache-2.0 OR BSD-3-Clause)")).toEqual([
      "MIT",
      "Apache-2.0",
      "BSD-3-Clause",
    ]);
  });
});
