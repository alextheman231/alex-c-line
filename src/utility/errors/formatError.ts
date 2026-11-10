import type { Command } from "commander";

import { normaliseIndents } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { ExecaError } from "execa";

import ERROR_PREFIX from "src/utility/constants/ERROR_PREFIX";
import ProgramError from "src/utility/errors/ProgramError";

function formatError(error: unknown, program: Command): never {
  if (error instanceof ExecaError) {
    const dataError = new DataError(
      {
        cwd: error.cwd,
        command: error.command,
        exitCode: error.exitCode,
        stderr: error.stderr,
        stdout: error.stdout,
      },
      error.code ?? "COMMAND_ERROR",
      error.message,
    );

    if (typeof error.stack === "string") {
      const execaLines = error.stack.split("\n");
      execaLines[0] = `${dataError.name}: ${dataError.message}`;
      dataError.stack = execaLines.join("\n");
    }

    Object.defineProperty(dataError, "originalError", {
      value: error,
      enumerable: false,
    });

    throw dataError;
  }

  if (error instanceof ProgramError) {
    if (error.exitCode === 0) {
      throw new DataError(
        { error },
        "INVALID_EXIT_CODE",
        normaliseIndents`
        This is an internal error in \`alex-c-line\`, please report it at https://github.com/alextheman231/alex-c-line/issues.

        Message: Exit code 0 is not a valid exit code for program errors.
      `,
      );
    }

    program.error(`${ERROR_PREFIX} ${error.message}`, {
      exitCode: error.exitCode,
      code: error.code,
    });
  }

  throw error;
}

export default formatError;
