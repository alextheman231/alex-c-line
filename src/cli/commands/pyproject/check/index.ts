import type { CreateEnumType } from "@alextheman/utility";
import type { Command } from "commander";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

import preferExactDependencyVersions from "src/cli/commands/pyproject/check/preferExactDependencyVersions";
import SUCCESS_PREFIX from "src/utility/constants/SUCCESS_PREFIX";

const RuleName = {
  PREFER_EXACT_DEPENDENCY_VERSIONS: "prefer-exact-dependency-versions",
} as const;
type RuleName = CreateEnumType<typeof RuleName>;

function pyprojectCheck(program: Command) {
  program
    .command("check")
    .description("Run checks on your pyproject.toml file")
    .option("--rules <rules>", "The name of the rule to check", (rawRules) => {
      const rawRuleNamesArray = rawRules.split(",");
      return parseZodSchema(z.array(z.enum(RuleName)), rawRuleNamesArray);
    })
    .action(async ({ rules }) => {
      if (rules?.includes("prefer-exact-dependency-versions")) {
        await preferExactDependencyVersions(program);
      }
      console.info(`${SUCCESS_PREFIX} Success! All checks passed!`);
    });
}

export default pyprojectCheck;
