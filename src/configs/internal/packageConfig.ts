import type { PreCommitStep } from "src/configs/internal/PreCommitStep";
import type { AlexCLineConfig, PreCommitStepOptions, StepFunction } from "src/configs/types";

function packageConfig<ScriptName extends string = PreCommitStep>(
  steps: Array<
    StepFunction | ScriptName | PreCommitStep | [ScriptName | PreCommitStep, PreCommitStepOptions]
  > = ["build", "format", "lint", "test"],
): AlexCLineConfig<PreCommitStep> {
  return {
    preCommit: {
      packageManager: "pnpm",
      steps: steps as Array<PreCommitStep>,
    },
    template: {
      pullRequest: {
        category: "general",
        projectType: "package",
      },
    },
  };
}

export default packageConfig;
