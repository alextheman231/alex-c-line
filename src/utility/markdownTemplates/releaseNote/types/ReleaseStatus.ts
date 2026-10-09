import type { ObjectValue } from "@alextheman/utility";

export const ReleaseStatus = {
  IN_PROGRESS: "In progress",
  RELEASED: "Released",
} as const;

export type ReleaseStatus = ObjectValue<typeof ReleaseStatus>;
