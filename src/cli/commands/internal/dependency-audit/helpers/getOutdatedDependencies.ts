import type { Command } from "commander";

import { az } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { DependencyGroup } from "src/configs";
import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/ALEX_C_LINE_PACKAGE_ROOT";

const pnpmOutdatedSchema = z.record(
  z.string(),
  z.object({
    current: az.versionNumber(),
    latest: az.versionNumber(),
    isDeprecated: z.boolean(),
    dependencyType: z.enum(DependencyGroup),
  }),
);
type OutdatedDependencies = z.infer<typeof pnpmOutdatedSchema>;
function parseOutdated(input: unknown): OutdatedDependencies {
  return az.with(pnpmOutdatedSchema).parse(input);
}

async function getOutdatedDependencies(program: Command): Promise<string> {
  const { exitCode, stdout, stderr } = await execa({ reject: false })`pnpm outdated --json`;
  if (!([0, 1] as Array<number | undefined>).includes(exitCode)) {
    program.error(stderr ?? stdout, {
      exitCode,
      code: "OUTDATED_DEPENDENCIES_ERROR",
    });
  }

  const outdatedDependencies = parseOutdated(JSON.parse(stdout.trim()));

  if (Object.keys(outdatedDependencies).length === 0) {
    return "No outdated dependencies found.";
  }

  const outdatedTemplatesPath = path.join(
    await ALEX_C_LINE_PACKAGE_ROOT,
    "templates",
    "dependencyAudit",
    "outdated",
  );

  const tableTemplate = await readFile(path.join(outdatedTemplatesPath, "table.html"), "utf-8");
  const tableRowTemplate = await readFile(
    path.join(outdatedTemplatesPath, "tableRow.html"),
    "utf-8",
  );

  return tableTemplate.replace(
    "{{tableRows}}",
    Object.entries(outdatedDependencies)
      .map(([packageName, data]) => {
        return tableRowTemplate
          .replace("{{packageName}}", packageName)
          .replace("{{currentVersion}}", data.current.toString())
          .replace("{{latestVersion}}", data.latest.toString())
          .replace("{{isDeprecated}}", data.isDeprecated ? "Yes" : "No")
          .replace("{{dependencyGroup}}", data.dependencyType);
      })
      .join("\n"),
  );
}

export default getOutdatedDependencies;
