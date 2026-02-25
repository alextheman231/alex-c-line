import { parseUUID } from "@alextheman/utility";
import { describe, expect, test } from "vitest";

import alexCLineTestClient from "tests/testClients/alexCLineTestClient";

describe("uuid generate", () => {
  test("Generates a random UUID in the terminal to use", async () => {
    const { exitCode, stdout: rawUUID } = await alexCLineTestClient`uuid generate`;
    expect(exitCode).toBe(0);
    expect(parseUUID(rawUUID.trim())).toBe(rawUUID.trim());
  });
});
