import type { Command } from "commander";

import deleteAlexCLineGlobalConfig from "src/services/configs/deleteAlexCLineGlobalConfig";
import upsertAlexCLineGlobalConfig from "src/services/configs/upsertAlexCLineGlobalConfig";

function configReset(program: Command) {
  program
    .command("reset")
    .description("Reset the alex-c-line configuration back to default settings.")
    .action(async () => {
      await deleteAlexCLineGlobalConfig();
      await upsertAlexCLineGlobalConfig({});
      console.info(
        "Config created with default settings. To see the current configuration settings that were set, run `alex-c-line config get`.",
      );
    });
}

export default configReset;
