import type { Command } from "commander";

import { DataError, parseZodSchema } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

import { readFile } from "node:fs/promises";
import path from "node:path";

import createStepRunner from "src/commands/pre-commit/createStepRunner";
import getCommandArguments from "src/commands/pre-commit/getCommandArguments";
import { PackageManager } from "src/configs/types/PreCommitConfig";
import findAlexCLineConfig from "src/utility/configs/findAlexCLineConfig";
import loadAlexCLineConfig from "src/utility/configs/loadAlexCLineConfig";

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
          { packageManager: rawPackageManager },
          "UNSUPPORTED_PACKAGE_MANAGER",
          `This package manager is not currently supported. Only the following are supported: ${Object.values(PackageManager).join(", ")}`,
        ),
      );

      const stepRunner = createStepRunner(program);

      for (const step of preCommitConfig.steps) {
        if (typeof step === "function") {
          await step(stepRunner);
        } else if (typeof step === "string") {
          await stepRunner(packageManager, getCommandArguments(program, step, scripts));
        } else {
          const [script, options] = step;
          await stepRunner(
            packageManager,
            getCommandArguments(program, script, scripts, options.arguments),
          );
        }
      }

      await stepRunner`git update-index --again`;
    });
}

export default preCommit2;
