import type { CreateEnumType } from "@alextheman/utility";

export const ReleaseStatus = {
  IN_PROGRESS: "In progress",
  RELEASED: "Released",
} as const;

export type ReleaseStatus = CreateEnumType<typeof ReleaseStatus>;
