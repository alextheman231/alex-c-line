import type { AlexCLineConfig } from "src/configs/types/AlexCLineConfig";

import { scripts } from "package.json" with { type: "json" };

const alexCLineConfig: AlexCLineConfig<keyof typeof scripts> = {
  createPullRequestTemplate: {
    category: "general",
    projectType: "package",
  },
  preCommit: {
    packageManager: "pnpm",
    steps: ["format", "lint", "test"],
    updateIndex: true,
  },
};

export default alexCLineConfig;
