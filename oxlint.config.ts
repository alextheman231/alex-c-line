import { oxlintConfigBase } from "@alextheman/configs/oxlint";

export default oxlintConfigBase({
  sortObjectKeysInFiles: ["src/cli/**/index.ts", "src/configs/internal/**"],
});
