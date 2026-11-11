import ProgramError from "src/utility/errors/ProgramError";

function getCommandArguments(
  script: string,
  scripts?: Record<string, string>,
  args?: Array<string>,
): Array<string> {
  if (!(script in (scripts ?? {}))) {
    throw new ProgramError(
      1,
      "SCRIPT_NOT_FOUND",
      `Could not find script \`${script}\` in package.json.`,
    );
  }
  const result = script === "test" ? [script] : ["run", script];

  if (args) {
    result.push(...args);
  }

  return result;
}

export default getCommandArguments;
