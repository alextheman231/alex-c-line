import type { PreCommitConfig } from "src/configs/types/preCommit/PreCommitConfig";
import type { TemplatePullRequestConfig } from "src/configs/types/template/pullRequest/TemplatePullRequestConfig";

export interface AlexCLineConfig<ScriptName extends string = string> {
  /** Configure settings related to the `alex-c-line` templates. */
  template?: {
    /** Configure settings related to the pull request templates. */
    pullRequest?: TemplatePullRequestConfig;
  };
  /** Configure the behaviour of the pre-commit command. */
  preCommit?: PreCommitConfig<ScriptName>;
}
