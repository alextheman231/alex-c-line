import type { AlexCLineConfig } from "src/configs/types";

const testConfig: AlexCLineConfig<"artwork"> = {
  preCommit: {
    packageManager: "pnpm",
    steps: ["artwork"],
    updateIndex: false,
  },
  template: {
    pullRequest: {
      category: "general",
      projectType: "package",
    },
  },
};

export default testConfig;
