import type { AlexCLineProjectCache } from "src/cache/project/types/AlexCLineProjectCache";

import { DataError } from "@alextheman/utility";
import { describe, expect, test } from "vitest";

import parseAlexCLineProjectCache from "src/cache/project/parseAlexCLineProjectCache";

import { version } from "package.json" with { type: "json" };

describe("parseAlexCLineProjectCache", () => {
  test("Is successful when input corresponds to a valid cache file", () => {
    const input: AlexCLineProjectCache = {
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

    const parsedInput = parseAlexCLineProjectCache(input);
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
      parseAlexCLineProjectCache(input);
    } catch (error) {
      if (error instanceof DataError) {
        expect(error.data.input).toEqual(input);
        expect(error.code).toContain("INVALID_TYPE");
      } else {
        throw error;
      }
    }
  });
});
