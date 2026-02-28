import type { Command } from "commander";

import { normaliseIndents } from "@alextheman/utility";
import { select } from "@inquirer/prompts";
import chalk from "chalk";

import addVariable from "src/cli/commands/edit-env-file/addVariable";
import changeExistingVariable from "src/cli/commands/edit-env-file/changeExistingVariable";
import parseDotenvFile from "src/utility/envFile/parseDotenvFile";

export type EditMode = "edit" | "delete";

function editEnvFile(program: Command) {
  program
    .command("edit-env-file")
    .description("Edit properties in a .env file")
    .option("--interactive", "Enable interactive mode", true) // will be false in future updates
    .option(
      "--file <filePath>",
      "The path to the .env file you want to edit, relative to the working directory this command is run",
      ".env",
    )
    .action(async ({ file, interactive }) => {
      if (interactive) {
        let exitInteractiveMode = false;
        while (!exitInteractiveMode) {
          const envFileContents = await parseDotenvFile(file);

          const variableToEdit = await select({
            choices: [
              ...Object.keys(envFileContents).map((key) => {
                return {
                  description: envFileContents[key] === "" ? "<empty>" : "<redacted for safety>",
                  name: key,
                  value: key,
                };
              }),
              {
                description: `Add a new environment variable to .env.`,
                name: `${chalk.green("+")} Add new environment variable`,
                value: "Add new",
              },
              {
                description: "Exit the .env file interactive editor.",
                name: `${chalk.dim("⏎")} Exit editor`,
                value: "Exit editor",
              },
            ],
            message: normaliseIndents`
            Please select the environment variable you wish to edit
            Currently editing file: ${file}
            `,
          });

          switch (variableToEdit) {
            case "Add new":
              await addVariable(program, envFileContents, file);
              break;
            case "Exit editor":
              exitInteractiveMode = true;
              break;
            default:
              await changeExistingVariable(envFileContents, variableToEdit, file);
          }
        }
      }
    });
}

export default editEnvFile;
