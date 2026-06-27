import { getRandomNumber } from "@alextheman/utility";
import { describe, expect, test } from "vitest";

import getNextFileName from "src/utility/fileSystem/getNextFileName";

describe("getNextFileName", () => {
  test("Gets the new file name as is if there are no duplicates.", () => {
    expect(getNextFileName(["test_document.md"], "new_document.md")).toBe("new_document.md");
  });
  test("Appends _1 if there is already an existing file.", () => {
    expect(getNextFileName(["test_document.md"], "test_document.md")).toBe("test_document_1.md");
  });
  test("Appends the next number up depending on the highest suffix", () => {
    const suffix = getRandomNumber(0, 100);
    expect(getNextFileName([`test_document_${suffix}.md`], "test_document.md")).toBe(
      `test_document_${suffix + 1}.md`,
    );
  });
});
