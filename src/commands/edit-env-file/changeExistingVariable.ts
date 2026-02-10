import type { DotenvParseOutput } from "dotenv";

import type { EditMode } from "src/commands/edit-env-file";

import { normaliseIndents } from "@alextheman/utility";
import { select } from "@inquirer/prompts";

import deleteVariable from "src/commands/edit-env-file/deleteVariable";
import editVariable from "src/commands/edit-env-file/editVariable";
import redact from "src/utility/redact";

async function changeExistingVariable(
  envFileContents: DotenvParseOutput,
  variableToEdit: string,
  file: string,
) {
  const editMode = await select<EditMode>({
    message: normaliseIndents`
                ${variableToEdit}: ${redact(envFileContents[variableToEdit])}

                Please select from the following actions:
            `,
    choices: [
      {
        name: "Edit",
        value: "edit",
      },
      {
        name: "Delete",
        value: "delete",
      },
    ],
  });

  switch (editMode) {
    case "edit":
      await editVariable(envFileContents, variableToEdit, file);
      break;
    case "delete":
      await deleteVariable(envFileContents, variableToEdit, file);
      break;
    default:
      // Will most likely never get there as inquirer should never give an unrecognised option, but it's here just in case.
      console.error("Unrecognised option");
  }
}

export default changeExistingVariable;
