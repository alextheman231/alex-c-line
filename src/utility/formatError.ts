import { DataError } from "@alextheman/utility";
import { ExecaError } from "execa";

function formatError(error: unknown): never {
  if (error instanceof ExecaError) {
    const dataError = new DataError(
      { cwd: error.cwd, command: error.command, exitCode: error.exitCode },
      error.code,
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

  throw error;
}

export default formatError;
