import type { AlexCLineConfig } from "src/configs/types/AlexCLineConfig";

import { parseZodSchemaAsync } from "@alextheman/utility";
import z from "zod";

import { createPullRequestTemplateSchema } from "src/configs/helpers/defineCreatePullRequestTemplateConfig";
import { preCommitConfigSchema } from "src/configs/helpers/definePreCommitConfig";

const alexCLineConfigSchema = z
  .strictObject({
    preCommit: preCommitConfigSchema,
    createPullRequestTemplate: createPullRequestTemplateSchema,
  })
  .partial();

export async function parseAlexCLineConfig(input: unknown): Promise<AlexCLineConfig> {
  return await parseZodSchemaAsync(alexCLineConfigSchema, input);
}

function defineAlexCLineConfig<ScriptName extends string = string>(
  config: AlexCLineConfig<ScriptName>,
): AlexCLineConfig<ScriptName> {
  return config;
}

export default defineAlexCLineConfig;
