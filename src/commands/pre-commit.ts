import type { Command } from "commander";

import { DataError, normaliseIndents, parseZodSchema } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

interface PreCommitOptions {
  build?: boolean;
  tests?: boolean;
  allowUnstaged?: boolean;
  repositoryManager?: string;
}

const deprecationMessage =
  "[DEPRECATED]: This command does not support the new alex-c-line config system. Please use `pre-commit-2` instead.";

function preCommit(program: Command) {
  program
    .command("pre-commit")
    .description(
      normaliseIndents`
        ${deprecationMessage}
        Run the standard pre-commits used across all my repositories.`,
    )
    .option("--no-build", "Skip the build")
    .option("--no-tests", "Skip the tests")
    .option("--allow-unstaged", "Run even if nothing is staged")
    .option(
      "--repository-manager <repositoryManager>",
      "The repository manager if it is a monorepo (Only Turborepo is supported as of now)",
    )
    .action(
      async ({
        build: shouldIncludeBuild,
        tests: shouldIncludeTests,
        allowUnstaged,
        repositoryManager: rawRepositoryManager,
      }: PreCommitOptions) => {
        console.warn(deprecationMessage);

        const repositoryManager = rawRepositoryManager
          ? parseZodSchema(
              z.enum(["turborepo"]),
              rawRepositoryManager?.toLowerCase(),
              new DataError(
                rawRepositoryManager,
                "INVALID_REPOSITORY_MANAGER",
                "The repository manager provided does not exist or is not currently supported. We currently support the following: `turborepo`.",
              ),
            )
          : undefined;

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
            if (allowUnstaged) {
              break;
            }
            console.info("No staged changes found. Use --allow-unstaged to run anyway.");
            return;
        }

        async function runCommandAndLogToConsole(command: string, args?: string[] | undefined) {
          const newArguments = [...(args ?? [])];

          if (repositoryManager === "turborepo") {
            newArguments.push("--ui=stream");
          }
          const result = await execaNoFail(command, newArguments, { stdio: "inherit" });

          if (result.exitCode !== 0) {
            program.error(
              `Command failed: ${command}${newArguments.length ? ` ${newArguments.join(" ")}` : ""}`,
              {
                exitCode: result.exitCode ?? 1,
                code: "PRE_COMMIT_FAILED",
              },
            );
          }

          return result;
        }

        if (shouldIncludeBuild) {
          await runCommandAndLogToConsole("pnpm", ["run", "build"]);
        }
        await runCommandAndLogToConsole("pnpm", ["run", "format"]);
        await runCommandAndLogToConsole("pnpm", ["run", "lint"]);
        if (shouldIncludeTests) {
          await runCommandAndLogToConsole("pnpm", ["test"]);
        }

        if (diffExitCode === 1) {
          await execaNoFail("git", ["update-index", "--again"]);
        }
      },
    );
}

export default preCommit;
