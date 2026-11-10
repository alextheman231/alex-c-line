import type { Command } from "commander";

import { parseIntStrict } from "@alextheman/utility";

import ProgramError from "src/utility/errors/ProgramError";

function internalThrowProgramError(program: Command) {
  program
    .command("throw-program-error")
    .description("Throw a test ProgramError")
    .option("-e, --exit-code <exitCode>", "The exit code to error with", parseIntStrict, 1)
    .action(({ exitCode }) => {
      throw new ProgramError(exitCode, "TEST_ERROR", "This is a test program error.");
    });
}

export default internalThrowProgramError;
