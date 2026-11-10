import type { Command } from "commander";

import { CodeError } from "@alextheman/utility/v6";

function internalThrowCodeError(program: Command) {
  program
    .command("throw-code-error")
    .description("Throw a test CodeError")
    .action(() => {
      throw new CodeError("TEST_ERROR", "This is a test program error.");
    });
}

export default internalThrowCodeError;
