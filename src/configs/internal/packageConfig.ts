import type { PreCommitSteps } from "src/configs/internal/PreCommitSteps";
import type { AlexCLineConfig } from "src/configs/types";

function packageConfig(
  steps: PreCommitSteps[] = ["build", "format", "lint", "test"],
): AlexCLineConfig<PreCommitSteps> {
  return {
    preCommit: {
      packageManager: "pnpm",
      steps,
    },
    createPullRequestTemplate: {
      category: "general",
      projectType: "package",
    },
  };
}

export default packageConfig;
