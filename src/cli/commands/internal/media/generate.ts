import type { Command } from "commander";

import { execa, ExecaError } from "execa";

import { stat } from "node:fs/promises";
import path from "node:path";

import errorPrefix from "src/utility/constants/errorPrefix";
import warningPrefix from "src/utility/constants/warningPrefix";
import readdirSafe from "src/utility/fileSystem/readdirSafe";

function internalMediaGenerate(program: Command) {
  program
    .command("generate")
    .argument("[target]", "The directory to generate from.", process.cwd())
    .option("--ignore <ignore>", "Extra directories to ignore as comma-separated list.")
    .option(
      "-r --resolution <resolution>",
      "The resolution of the rendered scenes, with a comma between width and height.",
    )
    .action(async (target, { ignore, resolution }) => {
      const ignored = new Set([
        ".git",
        "node_modules",
        "__pycache__",
        ".venv",
        "helpers",
        ...(ignore ? ignore.split(",") : []),
      ]);

      async function renderFile(file: string) {
        const relativePath = path.relative(process.cwd(), file);
        console.info(`Rendering ${relativePath}...`);

        const runManimCommand = execa({
          stdio: "inherit",
          env: { ...process.env, PYTHONPATH: path.resolve("src") },
        });

        try {
          if (resolution) {
            return await runManimCommand`manim -qh -r ${resolution} ${file}`;
          }
          return await runManimCommand`manim -qh ${file}`;
        } catch (error) {
          if (error instanceof ExecaError) {
            program.error(
              `${errorPrefix} An error has occurred with Manim while rendering ${relativePath}.`,
              {
                exitCode: error.exitCode ?? 1,
                code: "MANIM_ERROR",
              },
            );
          } else {
            throw error;
          }
        }
      }

      async function readDirectory(directory: string) {
        const entries = await readdirSafe(directory);
        if (entries === undefined) {
          return;
        }

        for (const entry of entries) {
          const fullPath = path.join(directory, entry.name);

          if (entry.isDirectory() && !ignored.has(entry.name)) {
            await readDirectory(fullPath);
          } else if (entry.isFile() && entry.name.endsWith(".py")) {
            await renderFile(fullPath);
          }
        }
      }

      const statResult = await stat(target);
      if (statResult.isFile()) {
        await renderFile(target);
      } else if (statResult.isDirectory()) {
        await readDirectory(target);
      } else {
        console.warn(`${warningPrefix} Not a file or directory.`);
      }
    });
}

export default internalMediaGenerate;
