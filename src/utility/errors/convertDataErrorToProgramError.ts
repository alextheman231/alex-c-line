import type { DataError } from "@alextheman/utility";
import type { Command } from "commander";

export interface ConvertDataErrorToProgramErrorOptions {
  exitCode?: number;
}

function convertDataErrorToProgramError(
  dataError: DataError,
  program: Command,
  options?: ConvertDataErrorToProgramErrorOptions,
) {
  program.error(dataError.message, {
    exitCode: options?.exitCode ?? 1,
    code: dataError.code,
  });
}

export default convertDataErrorToProgramError;
