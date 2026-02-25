import type { Command } from "commander";

import z from "zod";

import parseZodSchemaForProgram from "src/utility/miscellaneous/parseZodSchemaForProgram";
import checkUpdate from "src/utility/updates/checkUpdate";

// Will need this for mutual exclusivity checking with --check and --apply
const optionsSchema = z.object({
  check: z.boolean().optional(),
});

function update(program: Command) {
  program
    .command("update")
    .description("Handle updates of the currently installed alex-c-line")
    .option("--check", "Check for available updates")
    .option("--apply", "Apply the latest update")
    .action(async (rawOptions) => {
      const options = parseZodSchemaForProgram(program.error, optionsSchema, rawOptions);

      if (options.check) {
        await checkUpdate({ program, logNoUpdates: true });
      } else {
        console.info("Unsupported option. Expected `--check`.");
      }
    });
}

export default update;
