import type { AlexCLineConfig } from "src/configs/types";

const packageConfig: AlexCLineConfig<"build" | "format" | "lint" | "test"> = {
  preCommit: {
    packageManager: "pnpm",
    steps: ["build", "format", "lint", "test"],
  },
  createPullRequestTemplate: {
    category: "general",
    projectType: "package",
  },
};

export default packageConfig;
