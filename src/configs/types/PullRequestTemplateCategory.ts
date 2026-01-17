import type { CreateEnumType } from "@alextheman/utility";

const PullRequestTemplateCategory = {
  GENERAL: "general",
  INFRASTRUCTURE: "infrastructure",
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PullRequestTemplateCategory = CreateEnumType<typeof PullRequestTemplateCategory>;

export default PullRequestTemplateCategory;
