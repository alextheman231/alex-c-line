import type { CreateEnumType } from "@alextheman/utility";

export const ReleaseStatus = {
  IN_PROGRESS: "In progress",
  RELEASED: "Released",
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReleaseStatus = CreateEnumType<typeof ReleaseStatus>;
