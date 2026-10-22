import { assertNotUndefined, parseUUID } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { describe, expect, test } from "vitest";

import alexCLineTestClient from "tests/testClients/alexCLineTestClient";

describe("uuid generate", () => {
  test("Generates a random UUID in the terminal to use", async () => {
    const { exitCode, stdout: rawUUID } = await alexCLineTestClient`uuid generate`;
    assertNotUndefined(rawUUID);
    expect(exitCode).toBe(0);
    if (typeof rawUUID !== "string") {
      throw new DataError(
        { stdout: rawUUID, type: typeof rawUUID },
        "NOT_A_STRING",
        "The returned result is not a string.",
      );
    }
    expect(parseUUID(rawUUID.trim())).toBe(rawUUID.trim());
  });
});
