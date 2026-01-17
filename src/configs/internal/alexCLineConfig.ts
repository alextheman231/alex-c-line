import type { AlexCLineConfig } from "src/configs/types/AlexCLineConfig";

import { scripts } from "package.json" with { type: "json" };

const alexCLineConfig: AlexCLineConfig<keyof typeof scripts> = {
  preCommit: {
    packageManager: "pnpm",
    steps: ["format", "lint", "test"],
  },
  createPullRequestTemplate: {
    category: "general",
    projectType: "package",
  },
};

export default alexCLineConfig;
