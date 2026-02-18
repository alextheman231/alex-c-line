import type { PreCommitStep } from "src/configs/internal/PreCommitStep";
import type { AlexCLineConfig, PreCommitStepOptions, StepFunction } from "src/configs/types";

function packageConfig<ScriptName extends string = PreCommitStep>(
  steps: (
    | StepFunction
    | ScriptName
    | PreCommitStep
    | [ScriptName | PreCommitStep, PreCommitStepOptions]
  )[] = ["build", "format", "lint", "test"],
): AlexCLineConfig<PreCommitStep> {
  return {
    createPullRequestTemplate: {
      category: "general",
      projectType: "package",
    },
    preCommit: {
      packageManager: "pnpm",
      steps: steps as PreCommitStep[],
    },
  };
}

export default packageConfig;
