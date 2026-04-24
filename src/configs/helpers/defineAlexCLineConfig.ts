import type { AlexCLineConfig } from "src/configs/types/AlexCLineConfig";

import { az } from "@alextheman/utility";
import z from "zod";

import { preCommitConfigSchema } from "src/configs/helpers/preCommit/definePreCommitConfig";
import { templatePullRequestSchema } from "src/configs/helpers/template/pullRequest/defineTemplatePullRequestSchema";

const alexCLineConfigSchema = z
  .strictObject({
    preCommit: preCommitConfigSchema,
    template: z.object({
      pullRequest: templatePullRequestSchema,
    }),
  })
  .partial();

export async function parseAlexCLineConfig(input: unknown): Promise<AlexCLineConfig> {
  return await az.with(alexCLineConfigSchema).parseAsync(input);
}

function defineAlexCLineConfig<ScriptName extends string = string>(
  config: AlexCLineConfig<ScriptName>,
): AlexCLineConfig<ScriptName> {
  return config;
}

export default defineAlexCLineConfig;
