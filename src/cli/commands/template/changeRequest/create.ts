import type { Command } from "commander";

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import resolveBasename from "src/cli/commands/template/changeRequest/helpers/resolveBasename";
import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/ALEX_C_LINE_PACKAGE_ROOT";
import getNextFileName from "src/utility/fileSystem/getNextFileName";
import replaceMarkdownPlaceholders from "src/utility/markdownTemplates/replaceMarkdownPlaceholders";

function templateChangeRequestCreate(program: Command) {
  program
    .command("create")
    .description("Generate a change request document.")
    .requiredOption("-p, --project-name <projectName>", "The project to request a change for.")
    .requiredOption("-r, --reason <reason>", "The reason for the change.")
    .option(
      "-d, --description <description>",
      "A further description of the change.",
      "Redeploy the service.",
    )
    .requiredOption("-q, --requested-by <requestedBy>", "The user making the change request.")
    .option(
      "-o, --output-directory <outputDirectory>",
      "The directory to output the document in. The name of the document is determined by the reason.",
      path.join("docs", "changeRequests"),
    )
    .action(async ({ outputDirectory, ...templateVariables }) => {
      const resolvedOutputDirectory = path.resolve(outputDirectory);

      const rawContent = await readFile(
        path.join(await ALEX_C_LINE_PACKAGE_ROOT, "templates", "changeRequest", "template.md"),
        "utf-8",
      );
      const newDocumentContents = replaceMarkdownPlaceholders(rawContent, templateVariables);

      await mkdir(resolvedOutputDirectory, { recursive: true });

      const currentDirectoryContents = await readdir(resolvedOutputDirectory);
      const newFileName = getNextFileName(
        currentDirectoryContents,
        `${resolveBasename(templateVariables.reason)}.md`,
      );

      const outputPath = path.join(resolvedOutputDirectory, newFileName);
      await writeFile(outputPath, newDocumentContents);
      console.info(outputPath);
    });
}

export default templateChangeRequestCreate;
