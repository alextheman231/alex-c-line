import type { Command } from "commander";

import errorPrefix from "src/utility/constants/errorPrefix";

function getCommandArguments(
  program: Command,
  script: string,
  scripts?: Record<string, string>,
  args?: Array<string>,
): Array<string> {
  if (!(script in (scripts ?? {}))) {
    program.error(`${errorPrefix} Could not find script \`${script}\` in package.json.`, {
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
