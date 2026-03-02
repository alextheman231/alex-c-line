import type { AlexCLineConfig } from "src/configs/types";

const infrastructureConfig: AlexCLineConfig<"format" | "lint"> = {
  preCommit: {
    packageManager: "pnpm",
    steps: [
      async (stepRunner) => {
        await stepRunner`terraform init`;
      },
      "format",
      "lint",
    ],
  },
  template: {
    pullRequest: {
      category: "infrastructure",
      infrastructureProvider: "Terraform",
      requireConfirmationFrom: "AlexMan123456",
    },
  },
};

export default infrastructureConfig;
