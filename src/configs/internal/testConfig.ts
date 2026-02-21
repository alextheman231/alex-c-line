import type { AlexCLineConfig } from "src/configs/types";

const testConfig: AlexCLineConfig<"artwork"> = {
  createPullRequestTemplate: {
    category: "general",
    projectType: "package",
  },
  preCommit: {
    packageManager: "pnpm",
    steps: ["artwork"],
    updateIndex: false,
  },
};

export default testConfig;
