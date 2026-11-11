import type { DotenvParseOutput } from "dotenv";

import { normaliseIndents } from "@alextheman/utility";
import { input, password } from "@inquirer/prompts";

import upsertDotenvFile from "src/utility/envFile/upsertDotenvFile";
import UserError from "src/utility/errors/UserError";

async function addVariable<EnvContents extends DotenvParseOutput>(
  envFileContents: EnvContents,
  file: string,
) {
  const newVariableName = await input({
    message: "Please enter the name of the environment variable you would like to add.",
  });

  if (newVariableName in envFileContents) {
    throw new UserError(
      "DUPLICATE_ENVIRONMENT_VARIABLE_NAME",
      normaliseIndents`
        Error with chosen environment variable name ${newVariableName}.
        Variable name already exists. If you wish to edit this variable, please select it from the initial menu instead.
      `,
    );
  }

  if (/[ \t\r\n]/.test(newVariableName)) {
    throw new UserError(
      "INVALID_VARIABLE_NAME",
      normaliseIndents`
        Error with chosen environment variable name ${newVariableName}.
        Environment variables are not allowed to have whitespace.
      `,
    );
  }

  const newValue = await password({ message: `Please enter the new value for ${newVariableName}` });
  await upsertDotenvFile({ ...envFileContents, [newVariableName]: newValue }, file);
  console.info(`${newVariableName} successfully added.`);
}

export default addVariable;
