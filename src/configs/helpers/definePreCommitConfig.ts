import type { PreCommitConfig } from "src/configs/types/PreCommitConfig";

import { DataError, parseZodSchema } from "@alextheman/utility";
import z from "zod";

import { PackageManager } from "src/configs/types/PreCommitConfig";

export const preCommitStepOptionsSchema = z.object({
  arguments: z.array(z.string()).optional(),
});

export const preCommitConfigSchema = z.object({
  packageManager: z.enum(PackageManager).optional(),
  allowNoStagedChanges: z.boolean().optional(),
  steps: z.array(z.union([z.string(), z.tuple([z.string(), preCommitStepOptionsSchema])])),
});

function definePreCommitConfig<ScriptName extends string = string>(
  config: PreCommitConfig<ScriptName>,
): PreCommitConfig {
  return parseZodSchema(
    preCommitConfigSchema,
    config,
    new DataError(
      config,
      "INVALID_PRE_COMMIT_CONFIG",
      "The config provided does not match the expected shape.",
    ),
  );
}

export default definePreCommitConfig;
