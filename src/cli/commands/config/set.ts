import type { Command } from "commander";

import { kebabToCamel } from "@alextheman/utility";

import { parseAlexCLineGlobalConfigKey } from "src/configs/helpers/defineAlexCLineGlobalConfig";
import upsertAlexCLineGlobalConfig from "src/services/configs/upsertAlexCLineGlobalConfig";
import parseBooleanArgument from "src/utility/miscellaneous/parseBooleanArgument";

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
      console.info(`Config updated! Option \`${key}\` has been set to \`${newConfig[key]}\`.`);
    });
}

export default configSet;
