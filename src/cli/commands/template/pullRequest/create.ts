import type { Command } from "commander";

import { az, removeUndefinedFromObject } from "@alextheman/utility";
import { getPackageJsonContents } from "@alextheman/utility/internal";
import { DataError } from "@alextheman/utility/v6";
import z from "zod";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { PullRequestTemplateCategory } from "src/configs";
import { parseTemplatePullRequestConfig } from "src/configs/helpers/template/pullRequest/defineTemplatePullRequestSchema";
import findAlexCLineConfig from "src/utility/configs/findAlexCLineConfig";
import loadAlexCLineConfig from "src/utility/configs/loadAlexCLineConfig";
import createPullRequestTemplatesFromTemplates from "src/utility/markdownTemplates/pullRequest/createPullRequestTemplatesFromTemplates";

function templatePullRequestCreate(program: Command) {
  program
    .command("create")
    .option(
      "--category <category>",
      "The category of pull request templates to get (can be either `general` or `infrastructure`)",
      (rawValue) => {
        return az.with(z.enum(PullRequestTemplateCategory)).parse(rawValue, () => {
          program.error(
            `Invalid template category ${rawValue}. The category must be one of \`general\` or \`infrastructure\``,
          );
        });
      },
    )
    .option(
      "--project-name <projectName>",
      "The name of the package to use in the templates (leave blank to default to name found in package.json)",
    )
    .option(
      "--project-type <projectType>",
      "The type of project, used in phrases such as 'adds a new feature to the {{projectType}}'. This option must not be specified if category is `infrastructure`",
    )
    .option(
      "--infrastructure-provider <infrastructureProvider>",
      "If category is `infrastructure`, this would be the name of the Infrastructure provider (e.g. Terraform)",
    )
    .option(
      "--require-confirmation-from <requireConfirmationFrom>",
      "If category is `infrastructure`, this would be the name of the user to get approval from if a manual change was required",
    )
    .description(
      "Create pull request template files for a category (currently generates all templates in that category).",
    )
    .action(async (commandLineOptions) => {
      const configPath = await findAlexCLineConfig(process.cwd());
      const { template: { pullRequest: config } = {} } = configPath
        ? await loadAlexCLineConfig(configPath)
        : {};

      const packageInfo = await getPackageJsonContents(process.cwd());

      const { name: projectName } =
        commandLineOptions.projectName || config?.projectName
          ? { name: commandLineOptions.projectName ?? config?.projectName }
          : az.with(z.object({ name: z.string() })).parse(packageInfo);

      if (!projectName) {
        throw new DataError(
          { projectName },
          "PROJECT_NAME_NOT_FOUND",
          "Could not resolve project name.",
        );
      }

      const parsedOptions = parseTemplatePullRequestConfig(
        removeUndefinedFromObject({
          category: commandLineOptions.category ?? config?.category ?? "general",
          projectType:
            commandLineOptions.projectType ??
            (config?.category === "general" ? config?.projectType : undefined),
          infrastructureProvider:
            commandLineOptions.infrastructureProvider ??
            (config?.category === "infrastructure" ? config?.infrastructureProvider : undefined),
          requireConfirmationFrom:
            commandLineOptions.requireConfirmationFrom ??
            (config?.category === "infrastructure" ? config.requireConfirmationFrom : undefined),
        }),
      );

      const gitHubPath = path.join(process.cwd(), ".github");
      const pullRequestTemplatePath = path.join(gitHubPath, "PULL_REQUEST_TEMPLATE");

      const allTemplates = await createPullRequestTemplatesFromTemplates({
        ...parsedOptions,
        projectName,
      });

      await mkdir(gitHubPath, { recursive: true });
      await mkdir(pullRequestTemplatePath, { recursive: true });

      for (const templateName of Object.keys(allTemplates)) {
        if (templateName === "pull_request_template") {
          await writeFile(
            path.join(gitHubPath, "pull_request_template.md"),
            allTemplates[templateName],
          );
        } else {
          await writeFile(
            path.join(pullRequestTemplatePath, `${templateName}.md`),
            allTemplates[templateName],
          );
        }
      }

      console.info("Pull request templates created.");
    });
}

export default templatePullRequestCreate;
