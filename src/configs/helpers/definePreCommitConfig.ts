import type { PreCommitConfig } from "src/configs/types/PreCommitConfig";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

import { PackageManager } from "src/configs/types/PreCommitConfig";

export const preCommitStepOptionsSchema = z.strictObject({
  arguments: z.array(z.string()).optional(),
});

export const preCommitConfigSchema = z.strictObject({
  packageManager: z.enum(PackageManager).optional(),
  allowNoStagedChanges: z.boolean().optional(),
  steps: z.array(z.union([z.string(), z.tuple([z.string(), preCommitStepOptionsSchema])])),
});

export function parsePreCommitConfig(input: unknown): PreCommitConfig {
  return parseZodSchema(preCommitConfigSchema, input);
}

function definePreCommitConfig<ScriptName extends string = string>(
  config: PreCommitConfig<ScriptName>,
): PreCommitConfig<ScriptName> {
  return config;
}

export default definePreCommitConfig;
