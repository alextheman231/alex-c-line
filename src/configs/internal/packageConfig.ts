import type { PreCommitSteps } from "src/configs/internal/PreCommitSteps";
import type { AlexCLineConfig } from "src/configs/types";

function packageConfig(
  steps: PreCommitSteps[] = ["build", "format", "lint", "test"],
): AlexCLineConfig<PreCommitSteps> {
  return {
    createPullRequestTemplate: {
      category: "general",
      projectType: "package",
    },
    preCommit: {
      packageManager: "pnpm",
      steps,
    },
  };
}

export default packageConfig;
