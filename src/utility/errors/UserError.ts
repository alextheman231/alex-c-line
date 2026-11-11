import ProgramError from "src/utility/errors/ProgramError";

class UserError<ErrorCode extends string = string> extends ProgramError<ErrorCode> {
  public constructor(code: ErrorCode, message?: string, options?: ErrorOptions) {
    super(2, code, message, options);
  }
}

export default UserError;
