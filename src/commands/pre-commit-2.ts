import type { Command } from "commander";
import type { Result, TemplateExpression } from "execa";

import { DataError, interpolate, parseZodSchema } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { PackageManager } from "src/configs/types/PreCommitConfig";
import loadAlexCLineConfig from "src/utility/configLoaders/loadAlexCLineConfig";
import findAlexCLineConfig from "src/utility/findAlexCLineConfig";

function preCommit2(program: Command) {
  program
    .command("pre-commit-2")
    .description("Run the pre-commit scripts specified in the alex-c-line config (v2 experiment).")
    .option("--allow-no-staged-changes", "Run even if nothing is staged")
    .action(async ({ allowNoStagedChanges }) => {
      const configPath = await findAlexCLineConfig(process.cwd());
      if (!configPath) {
        program.error("Could not find the path to the alex-c-line config file. Does it exist?", {
          exitCode: 1,
          code: "ALEX_C_LINE_CONFIG_NOT_FOUND",
        });
      }
      const { preCommit: preCommitConfig } = await loadAlexCLineConfig(configPath);

      if (!preCommitConfig) {
        program.error("Could not find the pre-commit config in alex-c-line config.", {
          exitCode: 1,
          code: "PRE_COMMIT_CONFIG_NOT_FOUND",
        });
      }

      const execaNoFail = execa({ reject: false });
      const runCommandAndLogToConsole = execa({ reject: false, stdio: "inherit" });

      const { exitCode: diffExitCode } = await execaNoFail`git diff --cached --quiet`;

      switch (diffExitCode) {
        case 128:
          program.error("Not currently in a Git repository", {
            exitCode: 1,
            code: "GIT_DIFF_FAILED",
          });
        // program.error() will throw an error and stop the program, so it is redundant to include a break here.
        // eslint-disable-next-line no-fallthrough
        case 0:
          if (allowNoStagedChanges ?? preCommitConfig.allowNoStagedChanges) {
            break;
          }
          console.info("No staged changes found. Use --allow-no-staged-changes to run anyway.");
          return;
      }

      async function stepRunner(
        command: string,
        args?: readonly string[] | undefined,
      ): Promise<Result>;
      async function stepRunner(
        strings: TemplateStringsArray,
        ...interpolations: TemplateExpression[]
      ): Promise<Result>;
      async function stepRunner(
        first: string | TemplateStringsArray,
        ...second: unknown[]
      ): Promise<Result> {
        const result =
          typeof first === "string"
            ? await runCommandAndLogToConsole(first, second[0] as string[] | undefined)
            : await runCommandAndLogToConsole(
                first as TemplateStringsArray,
                ...(second as TemplateExpression[]),
              );

        if (result.exitCode !== 0) {
          const errorMessage =
            typeof first === "string"
              ? `${first}${Array.isArray(second[0]) && second[0].length ? ` ${(second[0] as string[]).join(" ")}` : ""}`
              : interpolate(first, ...(second as TemplateExpression[]));

          program.error(`Command failed: ${errorMessage}`, {
            exitCode: result.exitCode ?? 1,
            code: "PRE_COMMIT_FAILED",
          });
        }

        return result;
      }

      const { packageManager: packagePackageManager, scripts } = JSON.parse(
        await readFile(path.join(process.cwd(), "package.json"), "utf8"),
      );
      const rawPackageManager =
        preCommitConfig.packageManager ??
        (typeof packagePackageManager === "string"
          ? packagePackageManager.split("@")[0]
          : undefined);

      const packageManager = parseZodSchema(
        z.enum(PackageManager),
        rawPackageManager,
        new DataError(
          rawPackageManager,
          "UNSUPPORTED_PACKAGE_MANAGER",
          `This package manager is not currently supported. Only the following are supported: ${Object.values(PackageManager).join(", ")}`,
        ),
      );

      function getCommandArguments(script: string, args?: string[]): string[] {
        if (!(script in (scripts ?? {}))) {
          program.error(`Could not find script \`${script}\` in package.json.`, {
            exitCode: 1,
            code: "SCRIPT_NOT_FOUND",
          });
        }
        const result = script === "test" ? [script] : ["run", script];

        if (args) {
          result.push(...args);
        }

        return result;
      }

      for (const step of preCommitConfig.steps) {
        if (typeof step === "function") {
          await step(stepRunner);
        } else if (typeof step === "string") {
          await stepRunner(packageManager, getCommandArguments(step));
        } else {
          const [script, options] = step;
          await stepRunner(packageManager, getCommandArguments(script, options.arguments));
        }
      }

      await stepRunner`git update-index --again`;
    });
}

export default preCommit2;
