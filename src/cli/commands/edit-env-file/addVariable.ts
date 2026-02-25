import type { Command } from "commander";
import type { DotenvParseOutput } from "dotenv";

import { normaliseIndents } from "@alextheman/utility";
import { input, password } from "@inquirer/prompts";

import errorPrefix from "src/utility/constants/errorPrefix";
import upsertDotenvFile from "src/utility/envFile/upsertDotenvFile";

async function addVariable<EnvContents extends DotenvParseOutput>(
  program: Command,
  envFileContents: EnvContents,
  file: string,
) {
  const newVariableName = await input({
    message: "Please enter the name of the environment variable you would like to add.",
  });

  if (newVariableName in envFileContents) {
    program.error(
      `
            ${errorPrefix}: Error with chosen environment variable name ${newVariableName}.
            Variable name already exists. If you wish to edit this variable, please select it from the initial menu instead.
            `,
      {
        exitCode: 1,
        code: "DUPLICATE_ENVIRONMENT_VARIABLE_NAME",
      },
    );
  }

  if (/[ \t\r\n]/.test(newVariableName)) {
    program.error(
      normaliseIndents`
            ${errorPrefix}: Error with chosen environment variable name ${newVariableName}.
            Environment variables are not allowed to have whitespace.
            `,
      {
        exitCode: 1,
        code: "INVALID_VARIABLE_NAME",
      },
    );
  }

  const newValue = await password({ message: `Please enter the new value for ${newVariableName}` });
  await upsertDotenvFile({ ...envFileContents, [newVariableName]: newValue }, file);
  console.info(`${newVariableName} successfully added.`);
}

export default addVariable;
