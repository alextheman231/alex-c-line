import type { Command } from "commander";

import { normaliseIndents } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import getOutdatedDependencies from "src/cli/commands/internal/dependency-audit/helpers/getOutdatedDependencies";
import getPeerCheck from "src/cli/commands/internal/dependency-audit/helpers/getPeerCheck";
import getSecurityAudit from "src/cli/commands/internal/dependency-audit/helpers/getSecurityAudit";

function internalDependencyAudit(program: Command) {
  program
    .command("dependency-audit")
    .description("Run an audit of the PNPM dependencies")
    .option("-o, --output <path>", "Save the output to markdown file.")
    .action(async ({ output }) => {
      const securityAudit = await getSecurityAudit(program);
      const peerCheckResult = await getPeerCheck(program);
      const outdatedDependencies = await getOutdatedDependencies(program);

      const content = normaliseIndents`
        # JavaScript Dependency Audit

        ## Security Audit

        ${securityAudit}

        ## Peer Dependency Check

        ${peerCheckResult}

        ## Outdated Dependencies

        ${outdatedDependencies}
      `;

      console.info(content);

      if (output) {
        const fullSavePath = path.join(process.cwd(), output);
        if (path.extname(output) !== ".md") {
          throw new DataError(
            { output },
            "INVALID_FILE_EXTENSION",
            "The file extension must be `.md`",
          );
        }
        await writeFile(fullSavePath, content);
        console.info(`Audit results saved to ${fullSavePath}`);
      }
    });
}

export default internalDependencyAudit;
