import type { DataError } from "@alextheman/utility";
import type { Command } from "commander";

import errorPrefix from "src/utility/constants/errorPrefix";

export interface ConvertDataErrorToProgramErrorOptions {
  exitCode?: number;
}

function convertDataErrorToProgramError(
  dataError: DataError,
  program: Command,
  options?: ConvertDataErrorToProgramErrorOptions,
) {
  program.error(`${errorPrefix} ${dataError.message}`, {
    exitCode: options?.exitCode ?? 1,
    code: dataError.code,
  });
}

export default convertDataErrorToProgramError;
