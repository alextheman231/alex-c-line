export interface CreatePullRequestTemplateBaseConfig {
  /** The name of the project. */
  projectName?: string;
}

export interface CreatePullRequestTemplateGeneralConfig extends CreatePullRequestTemplateBaseConfig {
  /** The category of pull requests to get. */
  category: "general";
  /** The type of the project (this is what will be used as the noun in the pull request templates themselves). */
  projectType: string;
}

export interface CreatePullRequestTemplateInfrastructureConfig extends CreatePullRequestTemplateBaseConfig {
  /** The category of pull requests to get. */
  category: "infrastructure";
  /** The provider of the infrastructure */
  infrastructureProvider: string;
  /** Who to get confirmation from in the case of a manual change needed. */
  requireConfirmationFrom: string;
}

export type CreatePullRequestTemplateConfig =
  | CreatePullRequestTemplateGeneralConfig
  | CreatePullRequestTemplateInfrastructureConfig;
