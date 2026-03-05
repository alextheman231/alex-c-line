import type { Command } from "commander";
import type { Options, Result, TemplateExpression } from "execa";

import {
  getStringsAndInterpolations,
  interpolate,
  isTemplateStringsArray,
} from "@alextheman/utility";
import { execa } from "execa";

const runCommandAndLogToConsole = execa({ stdio: "inherit", reject: false } as const);

interface BaseOptions {
  stdio: "inherit";
  reject: false;
}

export interface StepRunner<ExecaOptions extends Options = BaseOptions> {
  <NewOpts extends Options>(options: NewOpts): StepRunner<ExecaOptions & NewOpts>;
  (command: string, args?: ReadonlyArray<string>): Promise<Result<ExecaOptions>>;
  (
    strings: TemplateStringsArray,
    ...interpolations: Array<TemplateExpression>
  ): Promise<Result<ExecaOptions>>;
}

async function evaluateResult<ExecaOptions extends Options>(
  program: Command,
  promisedResult: Promise<Result<ExecaOptions>>,
  failedCommand: string,
): Promise<Result<ExecaOptions>> {
  const result = await promisedResult;

  if (result.exitCode !== 0) {
    program.error(`Command failed: ${failedCommand}`, {
      exitCode: result.exitCode ?? 1,
      code: "PRE_COMMIT_FAILED",
    });
  }

  return result;
}

function bindStepRunner<ExecaOptions extends Options>(
  program: Command,
  boundOptions: ExecaOptions,
): StepRunner<ExecaOptions> {
  function stepRunner(first: unknown, ...second: Array<unknown>): unknown {
    if (typeof first === "string") {
      const command = first as string;
      const args = (second[0] as ReadonlyArray<string> | undefined) ?? [];
      const client = runCommandAndLogToConsole(boundOptions);
      return evaluateResult(
        program,
        client(command, args),
        `${command}${args.length ? ` ${args.join(" ")}` : ""}`,
      );
    }

    if (isTemplateStringsArray(first)) {
      const args = getStringsAndInterpolations<Array<TemplateExpression>>(
        first,
        ...(second as Array<TemplateExpression>),
      );
      const client = runCommandAndLogToConsole(boundOptions);
      return evaluateResult(program, client(...args), interpolate(...args));
    }

    return bindStepRunner(program, { ...boundOptions, ...(first as Options) } as ExecaOptions &
      Options);
  }

  return stepRunner as StepRunner<ExecaOptions>;
}

function createStepRunner(program: Command) {
  return bindStepRunner(program, {} as BaseOptions);
}

export default createStepRunner;
