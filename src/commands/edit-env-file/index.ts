import type { Command } from "commander";

import { select } from "@inquirer/prompts";
import chalk from "chalk";

import addVariable from "src/commands/edit-env-file/addVariable";
import changeExistingVariable from "src/commands/edit-env-file/changeExistingVariable";
import parseDotenvFile from "src/utility/parseDotenvFile";

export type EditMode = "edit" | "delete";

function editEnvFile(program: Command) {
  program
    .command("edit-env-file")
    .description("Edit properties in a .env file")
    .option("--interactive", "Enable interactive mode", true) // will be false in future updates
    .action(async ({ interactive }) => {
      if (interactive) {
        const envFileContents = await parseDotenvFile(".env");

        const variableToEdit = await select({
          message: "Please select the environment variable you wish to edit",
          choices: [
            ...Object.keys(envFileContents).map((key) => {
              return {
                name: key,
                value: key,
                description: "<redacted for safety>",
              };
            }),
            {
              name: `${chalk.green("+")} Add new environment variable`,
              value: "Add new",
              description: `Add a new environment variable to .env.`,
            },
          ],
        });

        if (variableToEdit === "Add new") {
          await addVariable(program, envFileContents);
        } else {
          await changeExistingVariable(envFileContents, variableToEdit);
        }
      }
    });
}

export default editEnvFile;
