import type { DataError } from "@alextheman/utility/v6";

import ProgramError from "src/utility/errors/ProgramError";

export interface ConvertDataErrorToProgramErrorOptions {
  exitCode?: number;
}

function convertDataErrorToProgramError(
  dataError: DataError,
  options?: ConvertDataErrorToProgramErrorOptions,
) {
  throw new ProgramError(options?.exitCode ?? 1, dataError.code, dataError.message);
}

export default convertDataErrorToProgramError;
