import type { Command } from "commander";

import { kebabToCamel } from "@alextheman/utility";
import { CodeError } from "@alextheman/utility/v6";

import { parseAlexCLineGlobalConfigKey } from "src/configs/helpers/defineAlexCLineGlobalConfig";
import loadAlexCLineGlobalConfig from "src/services/configs/loadAlexCLineGlobalConfig";

function configGet(program: Command) {
  program
    .command("get")
    .argument("[key]", "The key of the configuration option you want to get.", (value) => {
      return parseAlexCLineGlobalConfigKey(kebabToCamel(value));
    })
    .action(async (key) => {
      const config = await loadAlexCLineGlobalConfig();

      if (config === null) {
        throw new CodeError(
          "CONFIG_NOT_FOUND",
          "Configuration not set. Please run `alex-c-line config reset` to set up a default configuration.",
        );
      }

      if (key === undefined) {
        console.info(JSON.stringify(config, null, 2));
        return;
      }

      console.info(JSON.stringify({ [key]: config[key] }, null, 2));
    });
}

export default configGet;
