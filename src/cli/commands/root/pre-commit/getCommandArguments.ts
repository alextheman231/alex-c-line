import type { Command } from "commander";

import ERROR_PREFIX from "src/utility/constants/ERROR_PREFIX";

function getCommandArguments(
  program: Command,
  script: string,
  scripts?: Record<string, string>,
  args?: Array<string>,
): Array<string> {
  if (!(script in (scripts ?? {}))) {
    program.error(`${ERROR_PREFIX} Could not find script \`${script}\` in package.json.`, {
      exitCode: 1,
      code: "SCRIPT_NOT_FOUND",
    });
  }
  const result = script === "test" ? [script] : ["run", script];

  if (args) {
    result.push(...args);
  }

  return result;
}

export default getCommandArguments;
