import type { CreatePullRequestTemplateConfig } from "src/configs/types";

import { DataError, parseZodSchema } from "@alextheman/utility";
import z from "zod";

export const createPullRequestTemplateBaseSchema = z.object({
  projectName: z.string(),
});

export const createPullRequestTemplateSchema = z.discriminatedUnion("category", [
  createPullRequestTemplateBaseSchema.extend({
    category: z.literal("general"),
    projectType: z.string(),
  }),
  createPullRequestTemplateBaseSchema.extend({
    category: z.literal("infrastructure"),
    infrastructureProvider: z.string(),
    requireConfirmationFrom: z.string(),
  }),
]);

function defineCreatePullRequestTemplateConfig(
  config: CreatePullRequestTemplateConfig,
): CreatePullRequestTemplateConfig {
  return parseZodSchema(
    createPullRequestTemplateSchema,
    config,
    new DataError(
      config,
      "INVALID_PRE_COMMIT_CONFIG",
      "The config provided does not match the expected shape.",
    ),
  );
}

export default defineCreatePullRequestTemplateConfig;
