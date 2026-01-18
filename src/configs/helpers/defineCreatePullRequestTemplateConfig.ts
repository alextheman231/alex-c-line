import type { CreatePullRequestTemplateConfig } from "src/configs/types";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

export const createPullRequestTemplateBaseSchema = z.strictObject({
  projectName: z.string().optional(),
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

export function parseCreatePullRequestTemplateConfig(
  input: unknown,
): CreatePullRequestTemplateConfig {
  return parseZodSchema(createPullRequestTemplateSchema, input);
}

function defineCreatePullRequestTemplateConfig(
  config: CreatePullRequestTemplateConfig,
): CreatePullRequestTemplateConfig {
  return config;
}

export default defineCreatePullRequestTemplateConfig;
