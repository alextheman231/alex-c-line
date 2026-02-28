import type { Command } from "commander";

import { execa } from "execa";

import { readFile } from "node:fs/promises";
import path from "node:path";

import alexCLinePackageRoot from "src/utility/constants/alexCLinePackageRoot";

function outdatedDependencies(program: Command) {
  program.command("outdated-dependencies").action(async () => {
    const { exitCode, stdout, stderr } = await execa({ reject: false })`pnpm outdated --json`;
    if (!([0, 1] as (number | undefined)[]).includes(exitCode)) {
      program.error(stderr ?? stdout, {
        exitCode,
        code: "PNPM_OUDATED_ERROR",
      });
    }

    const outdatedDependencies: Record<string, Record<string, string>> = JSON.parse(stdout.trim());

    if (Object.keys(outdatedDependencies).length === 0) {
      console.info("NO_OUTDATED_DEPENDENCIES_FOUND");
    }

    const outdatedTemplatesPath = path.join(await alexCLinePackageRoot, "templates", "outdated");

    const tableTemplate = await readFile(path.join(outdatedTemplatesPath, "table.html"), "utf-8");
    const tableRowTemplate = await readFile(
      path.join(outdatedTemplatesPath, "tableRow.html"),
      "utf-8",
    );

    console.info(
      tableTemplate.replace(
        "{{tableRows}}",
        Object.entries(outdatedDependencies)
          .map(([packageName, metadata]) => {
            return tableRowTemplate
              .replace("{{packageName}}", packageName)
              .replace("{{currentVersion}}", metadata.current)
              .replace("{{latestVersion}}", metadata.latest);
          })
          .join("\n"),
      ),
    );
  });
}

export default outdatedDependencies;
