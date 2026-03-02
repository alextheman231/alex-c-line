import type { CreateEnumType } from "@alextheman/utility";
import type { Command } from "commander";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

import successPrefix from "src/utility/constants/successPrefix";

import noFileDependencies from "src/cli/commands/package-json/check/noFileDependencies";
import noPreReleaseDependencies from "src/cli/commands/package-json/check/noPreReleaseDependencies";

const RuleName = {
  NO_FILE_DEPENDENCIES: "no-file-dependencies",
  NO_PRE_RELEASE_DEPENDENCIES: "no-pre-release-dependencies",
} as const;
type RuleName = CreateEnumType<typeof RuleName>;

function packageJsonCheck(program: Command) {
  program
    .command("check")
    .description("Run checks on your package.json file")
    .option("--rules <rules>", "The name of the rule to check", (rawRules) => {
      const rawRuleNamesArray = rawRules.split(",");
      return parseZodSchema(z.array(z.enum(RuleName)), rawRuleNamesArray);
    })
    .action(async ({ rules }) => {
      if (rules?.includes("no-pre-release-dependencies")) {
        await noPreReleaseDependencies(program);
      }
      if (rules?.includes("no-file-dependencies")) {
        await noFileDependencies(program);
      }
      console.info(`${successPrefix} Success! All checks passed!`);
    });
}

export default packageJsonCheck;
