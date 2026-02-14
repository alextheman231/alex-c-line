import type { DataError } from "@alextheman/utility";
import type { Command } from "commander";

export interface ConvertDataErrorToProgramErrorOptions {
  exitCode?: number;
}

function convertDataErrorToProgramError(
  dataError: DataError,
  programError: Command["error"],
  options?: ConvertDataErrorToProgramErrorOptions,
) {
  programError(dataError.message, {
    exitCode: options?.exitCode ?? 1,
    code: dataError.code,
  });
}

export default convertDataErrorToProgramError;
