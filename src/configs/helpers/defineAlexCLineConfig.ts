import type { AlexCLineConfig } from "src/configs/types/AlexCLineConfig";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

import { createPullRequestTemplateSchema } from "src/configs/helpers/defineCreatePullRequestTemplateConfig";
import { preCommitConfigSchema } from "src/configs/helpers/definePreCommitConfig";

const alexCLineConfigSchema = z
  .strictObject({
    preCommit: preCommitConfigSchema,
    createPullRequestTemplate: createPullRequestTemplateSchema,
  })
  .partial();

export function parseAlexCLineConfig(input: unknown): AlexCLineConfig {
  return parseZodSchema(alexCLineConfigSchema, input);
}

function defineAlexCLineConfig<ScriptName extends string = string>(
  config: AlexCLineConfig<ScriptName>,
): AlexCLineConfig<ScriptName> {
  return config;
}

export default defineAlexCLineConfig;
