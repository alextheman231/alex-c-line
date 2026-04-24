import type { TemplatePullRequestConfig } from "src/configs";

import { az } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import matter from "gray-matter";
import z from "zod";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import findPackageRoot from "src/utility/fileSystem/findPackageRoot";

const __filename = fileURLToPath(import.meta.url);

function getTemplateVariables(config: Required<TemplatePullRequestConfig>): Record<string, string> {
  if (config.category === "general") {
    return {
      projectName: config.projectName,
      projectType: config.projectType,
    };
  }
  return {
    projectName: config.projectName,
    infrastructureProvider: config.infrastructureProvider,
    requireConfirmationFrom: config.requireConfirmationFrom,
  };
}

async function createPullRequestTemplatesFromTemplates(
  config: Required<TemplatePullRequestConfig>,
) {
  const templateVariables = getTemplateVariables(config);
  const { category } = config;

  const templatesPath = path.join(
    await findPackageRoot(path.dirname(__filename), "alex-c-line"),
    "templates",
    "pullRequest",
  );
  const templatesDirectory = await readdir(templatesPath);
  if (!templatesDirectory.includes(category)) {
    throw new DataError(
      { category },
      "CATEGORY_NOT_FOUND",
      "Category folder not found in the templates folder.",
    );
  }
  const categoryPath = path.join(templatesPath, category);
  const allCategoryTemplateNames = (await readdir(categoryPath)).filter((name) => {
    return name.endsWith(".md");
  });
  const allTemplates: Record<string, string> = {};

  for (const templateFileName of allCategoryTemplateNames) {
    const filePath = path.join(categoryPath, templateFileName);
    const { content, data } = matter(await readFile(filePath, "utf-8"));

    const templateName = az
      .with(z.string())
      .parse(data.id === "base" ? "pull_request_template" : data.id);
    const placeholders = az.with(z.array(z.string()).default([])).parse(data.placeholders);

    let finalContent = content;
    for (const placeholder of placeholders) {
      if (!(placeholder in templateVariables)) {
        throw new DataError(
          { placeholder },
          "INVALID_PLACEHOLDER",
          "The placeholder found in frontmatter can not be found in the metadata.",
        );
      }

      finalContent = finalContent.replaceAll(`{{${placeholder}}}`, templateVariables[placeholder]);
    }

    allTemplates[templateName] = finalContent;
  }
  return allTemplates;
}

export default createPullRequestTemplatesFromTemplates;
