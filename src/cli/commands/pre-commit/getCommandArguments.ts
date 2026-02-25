import type { Command } from "commander";

function getCommandArguments(
  program: Command,
  script: string,
  scripts?: Record<string, string>,
  args?: string[],
): string[] {
  if (!(script in (scripts ?? {}))) {
    program.error(`Could not find script \`${script}\` in package.json.`, {
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
