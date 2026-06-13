import type { CreateEnumType } from "@alextheman/utility";
import type { Command } from "commander";

import { az, normaliseIndents, sortBy } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

import { readFile } from "node:fs/promises";
import path from "node:path";

import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/ALEX_C_LINE_PACKAGE_ROOT";

const AuditSeverity = {
  INFO: "info",
  LOW: "low",
  MODERATE: "moderate",
  HIGH: "high",
  CRITICAL: "critical",
} as const;
type AuditSeverity = CreateEnumType<typeof AuditSeverity>;

const auditSchema = z.object({
  advisories: z.record(
    z.string(),
    z.object({
      title: z.string(),
      module_name: z.string(),
      vulnerable_versions: z.string(),
      patched_versions: z.string(),
      severity: z.enum(AuditSeverity),
      url: z.url(),
    }),
  ),
  metadata: z.object({
    vulnerabilities: z.object({
      info: z.number(),
      low: z.number(),
      moderate: z.number(),
      high: z.number(),
      critical: z.number(),
    }),
  }),
});
type SecurityAudit = z.infer<typeof auditSchema>;
function parseSecurityAudit(input: unknown): SecurityAudit {
  return az.with(auditSchema).parse(input);
}

async function getSecurityAudit(program: Command): Promise<string> {
  const { stdout, stderr, exitCode } = await execa({ reject: false })`pnpm audit --json`;

  if (!([0, 1] as Array<number | undefined>).includes(exitCode)) {
    program.error(stderr ?? stdout, {
      exitCode,
      code: "SECURITY_AUDIT_ERROR",
    });
  }

  const securityAudit = parseSecurityAudit(JSON.parse(stdout));

  const auditTemplatesPath = path.join(
    await ALEX_C_LINE_PACKAGE_ROOT,
    "templates",
    "dependencyAudit",
    "securityAudit",
  );

  const tableTemplate = await readFile(path.join(auditTemplatesPath, "table.html"), "utf-8");
  const tableRowTemplate = await readFile(path.join(auditTemplatesPath, "tableRow.html"), "utf-8");

  if (Object.keys(securityAudit.advisories).length === 0) {
    return "No security issues found";
  }

  const severityOrder: Record<AuditSeverity, number> = {
    critical: 5,
    high: 4,
    moderate: 3,
    low: 2,
    info: 1,
  };

  const auditTable = tableTemplate.replace(
    "{{tableRows}}",
    Object.entries(securityAudit.advisories)
      .toSorted(
        sortBy(([_, advisory]) => {
          return severityOrder[advisory.severity];
        }, "desc"),
      )
      .map(([id, data]) => {
        return tableRowTemplate
          .replace("{{advisoryId}}", id)
          .replace("{{severity}}", data.severity)
          .replace("{{packageName}}", data.module_name)
          .replace("{{title}}", data.title)
          .replace("{{affected}}", data.vulnerable_versions)
          .replace("{{patched}}", data.patched_versions)
          .replace("{{url}}", data.url);
      })
      .join("\n"),
  );

  const summaryListTemplate = await readFile(
    path.join(auditTemplatesPath, "summary.html"),
    "utf-8",
  );

  const summaryList = summaryListTemplate
    .replace("{{info}}", securityAudit.metadata.vulnerabilities.info.toString())
    .replace("{{low}}", securityAudit.metadata.vulnerabilities.low.toString())
    .replace("{{moderate}}", securityAudit.metadata.vulnerabilities.moderate.toString())
    .replace("{{high}}", securityAudit.metadata.vulnerabilities.high.toString())
    .replace("{{critical}}", securityAudit.metadata.vulnerabilities.critical.toString());

  return normaliseIndents`
    ### Summary
    
    ${summaryList}

    ### Audit Results

    ${auditTable}
  `;
}

export default getSecurityAudit;
