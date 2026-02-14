import type { Command } from "commander";

import z from "zod";

import checkUpdate from "src/commands/update/checkUpdate";
import parseZodSchemaForProgram from "src/utility/miscellaneous/parseZodSchemaForProgram";

// Will need this for mutual exclusivity checking with --check and --apply
const optionsSchema = z.object({
  check: z.boolean().optional(),
});

function update(program: Command) {
  program
    .command("update")
    .description("Handle updates of the currently installed alex-c-line")
    .option("--check", "Check for available updates")
    .action(async (rawOptions) => {
      const options = parseZodSchemaForProgram(program.error, optionsSchema, rawOptions);

      if (options.check) {
        await checkUpdate(program);
      } else {
        console.info("Unsupported option. Expected `--check`.");
      }
    });
}

export default update;
