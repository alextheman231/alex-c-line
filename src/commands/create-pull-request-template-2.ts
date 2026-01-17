import type { Command } from "commander";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { PullRequestTemplateCategory } from "src/configs";
import { parseCreatePullRequestTemplateConfig } from "src/configs/helpers/defineCreatePullRequestTemplateConfig";
import getPullRequestTemplatesFromMarkdown from "src/utility/getPullRequestTemplatesFromMarkdown";

function createPullRequestTemplate(program: Command) {
  program
    .command("create-pull-request-template")
    .alias("create-pull-request-template-2")
    .option(
      "--category <category>",
      "The category of pull request templates to get (can be either `general` or `infrastructure`)",
      (rawValue) => {
        return parseZodSchema(z.enum(PullRequestTemplateCategory), rawValue, () => {
          program.error(
            `Invalid template category ${rawValue}. The category must be one of \`general\` or \`infrastructure\``,
          );
        });
      },
      "general",
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
    .action(async (options) => {
      const packageInfo = JSON.parse(
        await readFile(path.join(process.cwd(), "package.json"), "utf-8"),
      );

      const { name: projectName } = options.projectName
        ? { name: options.projectName }
        : parseZodSchema(z.object({ name: z.string() }), packageInfo, () => {
            program.error(
              "Invalid package.json - expected package.json to contain a `name` property.",
              { exitCode: 1, code: "INVALID_PACKAGE_JSON" },
            );
          });

      const parsedOptions = parseCreatePullRequestTemplateConfig({ ...options, projectName });

      const gitHubPath = path.join(process.cwd(), ".github");
      const pullRequestTemplatePath = path.join(gitHubPath, "PULL_REQUEST_TEMPLATE");

      const allTemplates = await getPullRequestTemplatesFromMarkdown(parsedOptions);

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

export default createPullRequestTemplate;
