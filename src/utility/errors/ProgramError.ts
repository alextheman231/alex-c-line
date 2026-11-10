import type { ExpectErrorOptions } from "@alextheman/utility/v6";

import { containsKeys } from "@alextheman/utility";
import { CodeError } from "@alextheman/utility/v6";

class ProgramError<ErrorCode extends string = string> extends CodeError<ErrorCode> {
  public exitCode: number;

  public constructor(exitCode: number, code: ErrorCode, message?: string, options?: ErrorOptions) {
    super(code, message, options);

    this.exitCode = exitCode;
    this.name = new.target.name;

    Object.defineProperty(this, "message", { enumerable: true });
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public static override check<ErrorCode extends string = string>(
    input: unknown,
  ): input is ProgramError<ErrorCode> {
    if (input instanceof ProgramError) {
      return true;
    }

    return (
      containsKeys(input, ["exitCode", "code", "message"]) &&
      typeof input.exitCode === "number" &&
      typeof input.code === "string" &&
      typeof input.message === "string"
    );
  }
  public static override checkWithCode<ErrorCode extends string = string>(
    input: unknown,
    code: ErrorCode,
  ): input is ProgramError<ErrorCode> {
    return this.check(input) && input.code === code;
  }
  public static override expectError<ErrorCode extends string = string>(
    errorFunction: () => unknown,
    options?: ExpectErrorOptions<ErrorCode>,
  ): ProgramError<ErrorCode> {
    return super.expectError(errorFunction, options) as ProgramError<ErrorCode>;
  }
  public static override async expectErrorAsync<ErrorCode extends string = string>(
    errorFunction: () => Promise<unknown>,
    options?: ExpectErrorOptions<ErrorCode>,
  ): Promise<ProgramError<ErrorCode>> {
    return (await super.expectErrorAsync(errorFunction, options)) as ProgramError<ErrorCode>;
  }

  public override toJSON(): Omit<ProgramError<ErrorCode>, "toJSON" | "name"> {
    return {
      ...super.toJSON(),
      exitCode: this.exitCode,
    };
  }
}

export default ProgramError;
