import type { CreateEnumType } from "@alextheman/utility";

const PullRequestTemplateCategory = {
  GENERAL: "general",
  INFRASTRUCTURE: "infrastructure",
} as const;

export type PullRequestTemplateCategory = CreateEnumType<typeof PullRequestTemplateCategory>;

export default PullRequestTemplateCategory;
