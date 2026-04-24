import type { TemplatePullRequestConfig } from "src/configs/types";

import { az } from "@alextheman/utility";
import z from "zod";

export const templatePullRequestBaseSchema = z.strictObject({
  projectName: z.string().optional(),
});

export const templatePullRequestSchema = z.discriminatedUnion("category", [
  templatePullRequestBaseSchema.extend({
    category: z.literal("general"),
    projectType: z.string(),
  }),
  templatePullRequestBaseSchema.extend({
    category: z.literal("infrastructure"),
    infrastructureProvider: z.string(),
    requireConfirmationFrom: z.string(),
  }),
]);

export function parseTemplatePullRequestConfig(input: unknown): TemplatePullRequestConfig {
  return az.with(templatePullRequestSchema).parse(input);
}

function defineCreatePullRequestTemplateConfig(
  config: TemplatePullRequestConfig,
): TemplatePullRequestConfig {
  return config;
}

export default defineCreatePullRequestTemplateConfig;
