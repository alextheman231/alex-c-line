import type { CreateEnumType } from "@alextheman/utility";

export const PackageManager = {
  NPM: "npm",
  PNPM: "pnpm",
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PackageManager = CreateEnumType<typeof PackageManager>;

export interface PreCommitStepOptions {
  /** Arguments to pass to the given script */
  arguments?: string[];
}

export type StepRunner = (command: string, args?: string[]) => Promise<void>;
export type StepFunction = (stepRunner: StepRunner) => void | Promise<void>;

export interface PreCommitConfig<ScriptName extends string = string> {
  /** The name of the package manager being used (can choose from `npm` or `pnpm`). If not provided, can be inferred from the packageManager field in package.json. */
  packageManager?: PackageManager;
  /** Allow the hook to run even if there are no staged changes. */
  allowNoStagedChanges?: boolean;
  /** The steps to run in the pre-commit hook. */
  steps: (StepFunction | ScriptName | [ScriptName, PreCommitStepOptions])[];
}
