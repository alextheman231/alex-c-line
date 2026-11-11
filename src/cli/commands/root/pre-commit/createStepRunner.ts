import type { Options, Result, TemplateExpression } from "execa";

import {
  getStringsAndInterpolations,
  interpolate,
  isTemplateStringsArray,
} from "@alextheman/utility";
import { execa } from "execa";

import ProgramError from "src/utility/errors/ProgramError";

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
  promisedResult: Promise<Result<ExecaOptions>>,
  failedCommand: string,
  boundOptions: Options,
): Promise<Result<ExecaOptions>> {
  const result = await promisedResult;
  if (result.exitCode !== 0 && (boundOptions.reject ?? true)) {
    throw new ProgramError(
      result.exitCode ?? 1,
      "PRE_COMMIT_FAILED",
      `Command failed: ${failedCommand}`,
    );
  }

  return result;
}

function bindStepRunner<ExecaOptions extends Options>(
  boundOptions: ExecaOptions,
): StepRunner<ExecaOptions> {
  function stepRunner(first: unknown, ...second: Array<unknown>): unknown {
    if (typeof first === "string") {
      const command = first as string;
      const args = (second[0] as ReadonlyArray<string> | undefined) ?? [];
      const client = runCommandAndLogToConsole(boundOptions);
      return evaluateResult(
        client(command, args),
        `${command}${args.length ? ` ${args.join(" ")}` : ""}`,
        boundOptions,
      );
    }

    if (isTemplateStringsArray(first)) {
      const args = getStringsAndInterpolations<Array<TemplateExpression>>(
        first,
        ...(second as Array<TemplateExpression>),
      );
      const client = runCommandAndLogToConsole(boundOptions);
      return evaluateResult(client(...args), interpolate(...args), boundOptions);
    }

    return bindStepRunner({ ...boundOptions, ...(first as Options) } as ExecaOptions & Options);
  }

  return stepRunner as StepRunner<ExecaOptions>;
}

function createStepRunner() {
  return bindStepRunner({} as BaseOptions);
}

export default createStepRunner;
