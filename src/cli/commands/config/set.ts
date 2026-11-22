import type { Command } from "commander";

import { isNonNullableObject, kebabToCamel } from "@alextheman/utility";

import { parseAlexCLineGlobalConfigKey } from "src/models/configs/AlexCLineGlobalConfig";
import upsertAlexCLineGlobalConfig from "src/services/configs/upsertAlexCLineGlobalConfig";
import parseBooleanArgument from "src/utility/miscellaneous/parseBooleanArgument";
import stringifyJSON from "src/utility/miscellaneous/stringifyJSON";

function configSet(program: Command) {
  program
    .command("set")
    .description("Set a given configuration option.")
    .argument("<key>", "The key of the configuration option you want to set.", (value) => {
      return parseAlexCLineGlobalConfigKey(kebabToCamel(value));
    })
    .argument("<value>", "The value to set the given option to.", parseBooleanArgument)
    .action(async (key, value) => {
      const newConfig = await upsertAlexCLineGlobalConfig({ [key]: value });
      const newValue = newConfig[key];
      console.info(
        `Config updated! Option \`${key}\` has been set to \`${isNonNullableObject(newValue) ? stringifyJSON(newValue) : newValue?.toString()}\`.`,
      );
    });
}

export default configSet;
