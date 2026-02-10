import type { AlexCLineCache } from "src/utility/cache/parseAlexCLineCache";

import { DataError } from "@alextheman/utility";
import { describe, expect, test } from "vitest";

import parseAlexCLineCache from "src/utility/cache/parseAlexCLineCache";

import { version } from "package.json" with { type: "json" };

describe("parseAlexCLineCache", () => {
  test("Is successful when input corresponds to a valid cache file", () => {
    const input: AlexCLineCache = {
      useLocalPackage: {
        dependencies: {
          "@alextheman/utility": {
            previousVersion: version,
            currentVersion: "file:../utility",
            dependencyGroup: "dependencies",
          },
          "@alextheman/eslint-plugin": {
            previousVersion: version,
            dependencyGroup: "devDependencies",
            currentVersion: "file:../eslint-plugin",
          },
        },
      },
    };

    const parsedInput = parseAlexCLineCache(input);
    expect(parsedInput).toEqual(input);
  });

  test("Throws an error when input is not a valid cache file", () => {
    const input = {
      useLocalPackage: {
        dependencies: {
          "@alextheman/utility": {
            previousVersion: 1,
            currentVersion: 2,
          },
        },
      },
    };
    try {
      parseAlexCLineCache(input);
    } catch (error) {
      if (error instanceof DataError) {
        expect(error.data).toEqual(input);
        expect(error.code).toContain("INVALID_TYPE");
      } else {
        throw error;
      }
    }
  });
});
