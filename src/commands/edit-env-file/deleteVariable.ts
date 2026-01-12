import type { DotenvParseOutput } from "dotenv";

import { omitProperties } from "@alextheman/utility";
import { confirm } from "@inquirer/prompts";

import upsertDotenvFile from "src/utility/upsertDotenvFile";

async function deleteVariable<EnvContents extends DotenvParseOutput>(
  envFileContents: EnvContents,
  variableToEdit: keyof EnvContents,
) {
  const deleteConfirmation = await confirm({
    message: `Are you sure you want to delete \`${String(variableToEdit)}\`?`,
  });

  if (!deleteConfirmation) {
    console.info("Deletion aborted");
    return;
  }

  await upsertDotenvFile(omitProperties(envFileContents, variableToEdit), ".env");
  console.info(`${String(variableToEdit)} successfully deleted.`);
}

export default deleteVariable;
