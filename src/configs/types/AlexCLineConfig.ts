import type { CreatePullRequestTemplateConfig } from "src/configs/types/CreatePullRequestTemplateConfig";
import type { PreCommitConfig } from "src/configs/types/PreCommitConfig";

export interface AlexCLineConfig<ScriptName extends string = string> {
  createPullRequestTemplate?: CreatePullRequestTemplateConfig;
  preCommit?: PreCommitConfig<ScriptName>;
}
