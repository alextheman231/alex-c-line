export const PreCommitStep = {
  BUILD: "build",
  FORMAT: "format",
  LINT: "lint",
  TEST: "test",
} as const;

export type PreCommitStep = "build" | "format" | "lint" | "test";
