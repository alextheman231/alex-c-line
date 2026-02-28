import type { CreateEnumType } from "@alextheman/utility";
import type { Command } from "commander";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

import noPreReleaseDependencies from "src/cli/commands/package-json/noPreReleaseDependencies";

const RuleName = {
  NO_PRE_RELEASE_DEPENDENCIES: "no-pre-release-dependencies",
} as const;
type RuleName = CreateEnumType<typeof RuleName>;

function packageJson(program: Command) {
  program
    .command("package-json")
    .description("Run checks on your package.json file")
    .argument("[ruleName]", "The name of the rule to check", (rawRuleName) => {
      return parseZodSchema(z.enum(RuleName), rawRuleName);
    })
    .action(async (ruleName) => {
      if (ruleName === "no-pre-release-dependencies") {
        return await noPreReleaseDependencies(program);
      }
    });
}

export default packageJson;
