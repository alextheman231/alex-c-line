import type { AlexCLineConfig } from "src/configs/types";

const infrastructureConfig: AlexCLineConfig<"format" | "lint"> = {
  createPullRequestTemplate: {
    category: "infrastructure",
    infrastructureProvider: "Terraform",
    requireConfirmationFrom: "AlexMan123456",
  },
  preCommit: {
    packageManager: "pnpm",
    steps: [
      async (stepRunner) => {
        await stepRunner("terraform", ["init"]);
      },
      "format",
      "lint",
    ],
  },
};

export default infrastructureConfig;
