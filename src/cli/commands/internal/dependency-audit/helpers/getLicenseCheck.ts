import type { Command } from "commander";

import { az, escapeHTML, normaliseIndents, sortBy } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

import { readFile } from "node:fs/promises";
import path from "node:path";

import ALEX_C_LINE_PACKAGE_ROOT from "src/utility/constants/ALEX_C_LINE_PACKAGE_ROOT";

// TODO: Allow this to be configurable by alex-c-line.config.js
const ALLOWED_LICENSES = [
  "MIT",
  "MIT-0",
  "ISC",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "BlueOak-1.0.0",
  "Python-2.0",
  "0BSD",
  "Unlicense",
  "CC0-1.0",
];

const pnpmLicensesSchema = z.record(
  z.string(),
  z.array(
    z.object({
      name: z.string(),
      versions: z.array(z.string()),
    }),
  ),
);
type LicenseCheck = z.infer<typeof pnpmLicensesSchema>;
function parseLicenseCheck(input: unknown): LicenseCheck {
  return az.with(pnpmLicensesSchema).parse(input);
}

async function getLicenseCheck(program: Command): Promise<string> {
  const { exitCode, stdout, stderr } = await execa({ reject: false })`pnpm licenses ls --json`;
  if (!([0, 1] as Array<number | undefined>).includes(exitCode)) {
    program.error(stderr ?? stdout, {
      exitCode,
      code: "LICENSE_CHECK_ERROR",
    });
  }

  const licenseCheck = parseLicenseCheck(JSON.parse(stdout.trim()));

  const licenseEntries = Object.entries(licenseCheck);

  if (licenseEntries.length === 0) {
    return "No licenses found.";
  }

  const licenseCheckSummaryPath = path.join(
    await ALEX_C_LINE_PACKAGE_ROOT,
    "templates",
    "dependencyAudit",
    "licenseCheck",
    "summary",
  );

  const summaryTableTemplate = await readFile(
    path.join(licenseCheckSummaryPath, "table.html"),
    "utf-8",
  );
  const summaryTableRowTemplate = await readFile(
    path.join(licenseCheckSummaryPath, "tableRow.html"),
    "utf-8",
  );

  const summary = summaryTableTemplate.replace(
    "{{tableRows}}",
    licenseEntries
      .toSorted(
        sortBy(([_, data]) => {
          return data.length;
        }, "desc"),
      )
      .map(([license, data]) => {
        return summaryTableRowTemplate
          .replace("{{license}}", escapeHTML(license))
          .replace("{{count}}", escapeHTML(data.length.toString()));
      })
      .join("\n"),
  );

  const invalidLicenses = licenseEntries.filter(([license, _]) => {
    return !ALLOWED_LICENSES.includes(license);
  });

  let invalidSummary: string;

  if (invalidLicenses.length === 0) {
    invalidSummary = "No licenses requiring review.";
  } else {
    const invalidLicensesInvalidPath = path.join(
      await ALEX_C_LINE_PACKAGE_ROOT,
      "templates",
      "dependencyAudit",
      "licenseCheck",
      "invalid",
    );

    const invalidLicensesTableTemplate = await readFile(
      path.join(invalidLicensesInvalidPath, "table.html"),
      "utf-8",
    );
    const invalidLicensesTableRowTemplate = await readFile(
      path.join(invalidLicensesInvalidPath, "tableRow.html"),
      "utf-8",
    );

    const invalidLicensesListTemplate = await readFile(
      path.join(invalidLicensesInvalidPath, "list.html"),
      "utf-8",
    );
    const invalidLicensesListItemTemplate = await readFile(
      path.join(invalidLicensesInvalidPath, "listItem.html"),
      "utf-8",
    );

    invalidSummary = invalidLicensesTableTemplate.replace(
      "{{tableRows}}",
      invalidLicenses
        .map(([license, data]) => {
          return invalidLicensesTableRowTemplate
            .replaceAll("{{license}}", escapeHTML(license))
            .replace("{{count}}", escapeHTML(data.length.toString()))
            .replace(
              "{{dependencies}}",
              invalidLicensesListTemplate.replace(
                "{{listItems}}",
                data
                  .flatMap((item) => {
                    return item.versions.map((version) => {
                      return invalidLicensesListItemTemplate
                        .replace("{{name}}", escapeHTML(item.name))
                        .replace("{{version}}", escapeHTML(version));
                    });
                  })
                  .join(""),
              ),
            );
        })
        .join("\n"),
    );
  }

  return normaliseIndents`
    
    ### Summary

    ${summary}

    ### Requires Review

    ${invalidSummary}
  `;
}

export default getLicenseCheck;
