import type { Options, Result, TemplateExpression } from "execa";

import { isTemplateStringsArray } from "@alextheman/utility";
import { execa } from "execa";

import path from "node:path";

const localDistDirectory = path.resolve(process.cwd(), "dist");
const entryPoint = path.join(localDistDirectory, "index.js");

export interface AlexCLineTestClient<ExecaOptions extends Options = Options> {
  (options: ExecaOptions): AlexCLineTestClient<ExecaOptions>;
  (
    strings: TemplateStringsArray,
    ...interpolations: Array<TemplateExpression>
  ): Promise<Result<object>>;
  (command: string, args?: Array<string>, options?: ExecaOptions): Promise<Result<ExecaOptions>>;
}

function resolveTemplateToArgs(
  strings: TemplateStringsArray,
  ...interpolations: Array<TemplateExpression>
): Array<string> {
  const result: Array<string> = [];

  for (let i = 0; i < strings.length; i++) {
    const parts = strings[i].trim().split(/\s+/).filter(Boolean);
    result.push(...parts);

    if (i < interpolations.length) {
      result.push(String(interpolations[i]));
    }
  }

  return result;
}

function resolveAsTemplate<ExecaOptions extends Options = Options>(
  strings: TemplateStringsArray,
  interpolations: Array<TemplateExpression>,
  options?: ExecaOptions,
) {
  const args = resolveTemplateToArgs(strings, ...interpolations);

  return execa(process.execPath, [entryPoint, ...args], options);
}

function resolveAsCommandArgs<ExecaOptions extends Options = Options>(
  command: string,
  args: ReadonlyArray<string>,
  options?: ExecaOptions,
) {
  return execa(process.execPath, [entryPoint, command, ...args], options);
}

function bindAlexCLineClient<ExecaOptions extends Options = Options>(
  boundOptions: ExecaOptions,
): AlexCLineTestClient<ExecaOptions> {
  function client(first: unknown, ...second: Array<unknown>): unknown {
    if (typeof first === "string") {
      return resolveAsCommandArgs(first as string, (second[0] as Array<string>) ?? [], {
        ...boundOptions,
        ...(second[1] as Options | undefined),
      });
    }

    if (isTemplateStringsArray(first)) {
      return resolveAsTemplate(first, second as Array<TemplateExpression>, boundOptions);
    }

    return bindAlexCLineClient({ ...boundOptions, ...(first as Options) } as ExecaOptions);
  }

  return client as AlexCLineTestClient<ExecaOptions>;
}

function alexCLineTestClient<ExecaOptions extends Options = Options>(
  options: ExecaOptions,
): AlexCLineTestClient<ExecaOptions>;
function alexCLineTestClient(
  strings: TemplateStringsArray,
  ...interpolations: Array<TemplateExpression>
): Promise<Result<object>>;
function alexCLineTestClient<ExecaOptions extends Options = Options>(
  command: string,
  args?: ReadonlyArray<string>,
  options?: ExecaOptions,
): Promise<Result<ExecaOptions>>;
function alexCLineTestClient<ExecaOptions extends Options = Options>(
  first: string | TemplateStringsArray | ExecaOptions,
  ...second: Array<unknown>
): Promise<Result<ExecaOptions>> | Promise<Result<object>> | AlexCLineTestClient<ExecaOptions> {
  if (typeof first === "string") {
    return resolveAsCommandArgs<ExecaOptions>(
      first,
      (second[0] as Array<string>) ?? [],
      second[1] as ExecaOptions | undefined,
    );
  }

  if (isTemplateStringsArray(first)) {
    return resolveAsTemplate(first, second as Array<TemplateExpression>);
  }

  return bindAlexCLineClient(first);
}

export default alexCLineTestClient;
