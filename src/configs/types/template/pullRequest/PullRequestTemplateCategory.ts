import type { ObjectValue } from "@alextheman/utility";

const PullRequestTemplateCategory = {
  GENERAL: "general",
  INFRASTRUCTURE: "infrastructure",
} as const;

export type PullRequestTemplateCategory = ObjectValue<typeof PullRequestTemplateCategory>;

export default PullRequestTemplateCategory;
