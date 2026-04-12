import type { DataError } from "@alextheman/utility";
import type { Command } from "commander";

import ERROR_PREFIX from "src/utility/constants/ERROR_PREFIX";

export interface ConvertDataErrorToProgramErrorOptions {
  exitCode?: number;
}

function convertDataErrorToProgramError(
  dataError: DataError,
  program: Command,
  options?: ConvertDataErrorToProgramErrorOptions,
) {
  program.error(`${ERROR_PREFIX} ${dataError.message}`, {
    exitCode: options?.exitCode ?? 1,
    code: dataError.code,
  });
}

export default convertDataErrorToProgramError;
