import type { DotenvParseOutput } from "dotenv";

import { password } from "@inquirer/prompts";

import upsertDotenvFile from "src/utility/upsertDotenvFile";

async function editVariable<EnvContents extends DotenvParseOutput>(
  envFileContents: EnvContents,
  variableToEdit: keyof EnvContents,
) {
  const newValue = await password({
    message: `Please enter new value for \`${String(variableToEdit)}\``,
  });
  await upsertDotenvFile({ ...envFileContents, [variableToEdit]: newValue }, ".env");
  console.info(`${String(variableToEdit)} successfully updated.`);
}

export default editVariable;
