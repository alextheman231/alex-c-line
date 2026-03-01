import type { Command } from "commander";

import checkUpdate from "src/utility/updates/checkUpdate";

function checkUpdateCommand(program: Command) {
  program
    .command("check")
    .description("Check for alex-c-line updates")
    .action(async () => {
      await checkUpdate({ program, logNoUpdates: true });
    });
}

export default checkUpdateCommand;
