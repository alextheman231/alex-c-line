import type { Options, Result, TemplateExpression } from "execa";

import { createTemplateStringsArray, getInterpolations } from "@alextheman/utility";
import { execa } from "execa";

import path from "node:path";

const localDistDirectory = path.resolve(process.cwd(), "dist");
const entryPoint = path.join(localDistDirectory, "index.js");

export interface AlexCLineTestClient<ExecaOptions extends Options = Options> {
  (options: ExecaOptions): AlexCLineTestClient<ExecaOptions>;
  (strings: TemplateStringsArray, ...interpolations: TemplateExpression[]): Promise<Result<object>>;
  (command: string, args?: string[], options?: ExecaOptions): Promise<Result<ExecaOptions>>;
}

function isTemplateStringsArray(input: unknown): input is TemplateStringsArray {
  return typeof input === "object" && input !== null && "raw" in input;
}

function resolveAsTemplate<ExecaOptions extends Options = Options>(
  strings: TemplateStringsArray,
  interpolations: TemplateExpression[],
  options?: ExecaOptions,
) {
  const [newStrings, newInterpolations] = getInterpolations(
    createTemplateStringsArray([
      `${process.execPath} ${entryPoint} ${strings[0]}`,
      ...strings.slice(1),
    ]),
    ...interpolations,
  ) as [TemplateStringsArray, TemplateExpression[]];

  return options
    ? execa(options)(...[createTemplateStringsArray(newStrings), ...newInterpolations])
    : execa(...[createTemplateStringsArray(newStrings), ...newInterpolations]);
}

function resolveAsCommandArgs<ExecaOptions extends Options = Options>(
  command: string,
  args: readonly string[],
  options?: ExecaOptions,
) {
  return execa(process.execPath, [entryPoint, command, ...args], options);
}

function bindAlexCLineClient<ExecaOptions extends Options = Options>(
  boundOptions: ExecaOptions,
): AlexCLineTestClient<ExecaOptions> {
  function client(first: unknown, ...second: unknown[]): unknown {
    if (typeof first === "object" && first !== null && !isTemplateStringsArray(first)) {
      return bindAlexCLineClient({ ...boundOptions, ...(first as Options) } as ExecaOptions);
    }

    if (isTemplateStringsArray(first)) {
      return resolveAsTemplate(first, second as TemplateExpression[], boundOptions);
    }

    return resolveAsCommandArgs(first as string, (second[0] as string[]) ?? [], {
      ...boundOptions,
      ...(second[1] as Options | undefined),
    });
  }

  return client as AlexCLineTestClient<ExecaOptions>;
}

function alexCLineTestClient<ExecaOptions extends Options = Options>(
  options: ExecaOptions,
): AlexCLineTestClient<ExecaOptions>;
function alexCLineTestClient(
  strings: TemplateStringsArray,
  ...interpolations: TemplateExpression[]
): Promise<Result<object>>;
function alexCLineTestClient<ExecaOptions extends Options = Options>(
  command: string,
  args?: readonly string[],
  options?: ExecaOptions,
): Promise<Result<ExecaOptions>>;
function alexCLineTestClient<ExecaOptions extends Options = Options>(
  first: string | TemplateStringsArray | ExecaOptions,
  ...second: unknown[]
): Promise<Result<ExecaOptions>> | Promise<Result<object>> | AlexCLineTestClient<ExecaOptions> {
  if (typeof first === "string") {
    return resolveAsCommandArgs<ExecaOptions>(
      first,
      (second[0] as string[]) ?? [],
      second[1] as ExecaOptions | undefined,
    );
  }

  if (isTemplateStringsArray(first)) {
    return resolveAsTemplate(first, second as TemplateExpression[]);
  }

  return bindAlexCLineClient(first);
}

export function createAlexCLineTestClient(defaultOptions?: Options) {
  return async (command: string, args?: string[], options?: Options) => {
    return await alexCLineTestClient(command, args, { ...defaultOptions, ...options });
  };
}

export function createAlexCLineTestClientInDirectory(directory: string) {
  return async (command: string, args?: string[], options?: Omit<Options, "cwd">) => {
    return await alexCLineTestClient(command, args, {
      ...options,
      cwd: directory,
      env: {
        HOME: directory.split("/").slice(0, -1).join("/"),
      },
    });
  };
}

export default alexCLineTestClient;
