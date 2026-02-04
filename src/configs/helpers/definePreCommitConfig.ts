import type { PreCommitConfig } from "src/configs/types/PreCommitConfig";

import { parseZodSchemaAsync } from "@alextheman/utility";
import z from "zod";

import { PackageManager } from "src/configs/types/PreCommitConfig";

export const preCommitStepOptionsSchema = z.strictObject({
  arguments: z.array(z.string()).optional(),
});

export const preCommitConfigSchema = z.strictObject({
  packageManager: z.enum(PackageManager).optional(),
  allowNoStagedChanges: z.boolean().optional(),
  steps: z.array(
    z.union([
      z.function({
        input: [z.function()],
        output: z.any(),
      }),
      z.string(),
      z.tuple([z.string(), preCommitStepOptionsSchema]),
    ]),
  ),
});

export async function parsePreCommitConfig(input: unknown): Promise<PreCommitConfig> {
  return await parseZodSchemaAsync(preCommitConfigSchema, input);
}

function definePreCommitConfig<ScriptName extends string = string>(
  config: PreCommitConfig<ScriptName>,
): PreCommitConfig<ScriptName> {
  return config;
}

export default definePreCommitConfig;
