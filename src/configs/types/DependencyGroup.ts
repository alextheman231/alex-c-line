import type { CreateEnumType } from "@alextheman/utility";

export const DependencyGroup = {
  DEPENDENCIES: "dependencies",
  DEV_DEPENDENCIES: "devDependencies",
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DependencyGroup = CreateEnumType<typeof DependencyGroup>;
