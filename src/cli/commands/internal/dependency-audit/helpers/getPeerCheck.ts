import type { Command } from "commander";

import { az } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

import { readFile } from "node:fs/promises";
import path from "node:path";

import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/ALEX_C_LINE_PACKAGE_ROOT";

const pnpmPeerCheckSchema = z.object({
  ".": z.object({
    bad: z.record(
      z.string(),
      z.array(
        z.object({
          parents: z.array(
            z.object({
              name: z.string(),
              version: az.versionNumber(),
            }),
          ),
          optional: z.boolean(),
          wantedRange: z.string(),
          foundVersion: az.versionNumber(),
        }),
      ),
    ),
  }),
});
type PeerCheck = z.infer<typeof pnpmPeerCheckSchema>;
function parsePeerCheck(input: unknown): PeerCheck {
  return az.with(pnpmPeerCheckSchema).parse(input);
}

async function getPeerCheck(program: Command): Promise<string> {
  const { stdout, stderr, exitCode } = await execa({ reject: false })`pnpm peers check --json`;

  if (!([0, 1] as Array<number | undefined>).includes(exitCode)) {
    program.error(stderr ?? stdout, {
      exitCode,
      code: "PEERS_CHECK_ERROR",
    });
  }

  const peerCheck = parsePeerCheck(JSON.parse(stdout));

  const auditTemplatesPath = path.join(
    await ALEX_C_LINE_PACKAGE_ROOT,
    "templates",
    "dependencyAudit",
    "peerCheck",
  );

  const peerCheckTableTemplate = await readFile(
    path.join(auditTemplatesPath, "table.html"),
    "utf-8",
  );
  const peerCheckTableRowTemplate = await readFile(
    path.join(auditTemplatesPath, "tableRow.html"),
    "utf-8",
  );

  if (Object.keys(peerCheck["."].bad).length === 0) {
    return "No peer dependency issues found";
  }

  const peerCheckTable = peerCheckTableTemplate.replace(
    "{{tableRows}}",
    Object.entries(peerCheck["."].bad)
      .flatMap(([packageName, data]) => {
        return data.map((item) => {
          return peerCheckTableRowTemplate
            .replace("{{packageName}}", packageName)
            .replace("{{currentVersion}}", item.foundVersion.toString())
            .replace("{{wantedRange}}", item.wantedRange)
            .replace(
              "{{parentDependencies}}",
              item.parents
                .map((parent) => {
                  return `${parent.name}@${parent.version}`;
                })
                .join(", "),
            );
        });
      })
      .join("\n"),
  );

  return peerCheckTable;
}

export default getPeerCheck;
