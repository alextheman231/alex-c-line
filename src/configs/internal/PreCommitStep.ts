export const PreCommitStep = {
  BUILD: "build",
  FORMAT: "format",
  LINT: "lint",
  TEST: "test",
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PreCommitStep = "build" | "format" | "lint" | "test";
