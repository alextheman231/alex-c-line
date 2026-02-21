import type { CreateEnumType } from "@alextheman/utility";

export const DependencyGroup = {
  DEPENDENCIES: "dependencies",
  DEV_DEPENDENCIES: "devDependencies",
} as const;

export type DependencyGroup = CreateEnumType<typeof DependencyGroup>;
