import type { AlexCLineConfig } from "src/configs/types/AlexCLineConfig";

const alexCLineConfig: AlexCLineConfig = {
  preCommit: {
    packageManager: "pnpm",
    steps: ["format", "lint", "test"],
    updateIndex: true,
  },
  template: {
    pullRequest: {
      category: "general",
      projectType: "package",
    },
  },
};

export default alexCLineConfig;
