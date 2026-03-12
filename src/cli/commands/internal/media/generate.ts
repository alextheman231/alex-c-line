import type { Command } from "commander";

import { execa } from "execa";

import { readdir } from "node:fs/promises";
import path from "node:path";

function internalMediaGenerate(program: Command) {
  program
    .command("generate")
    .argument("[directory]", "The directory to generate from", process.cwd())
    .action(async (directory) => {
      async function readDirectory(directory: string) {
        const directoryContents = await readdir(directory, { withFileTypes: true });

        for (const entry of directoryContents) {
          const fullPath = path.join(directory, entry.name);
          if (
            entry.isDirectory() &&
            ![".git", "node_modules", "__pycache__", ".venv"].includes(entry.name)
          ) {
            await readDirectory(fullPath);
          }

          if (entry.isFile() && entry.name.endsWith(".py")) {
            console.info(`Rendering ${path.relative(process.cwd(), fullPath)}...`);
            await execa({ stdio: "inherit" })`manim -pql ${fullPath}`;
          }
        }
      }

      await readDirectory(directory);
    });
}

export default internalMediaGenerate;
