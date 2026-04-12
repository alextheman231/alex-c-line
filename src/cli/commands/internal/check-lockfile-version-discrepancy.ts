import type { Command } from "commander";

import { readFile } from "node:fs/promises";
import path from "node:path";

import ERROR_PREFIX from "src/utility/constants/ERROR_PREFIX";

function checkLockfileVersionDiscrepancy(program: Command) {
  program
    .command("check-lockfile-version-discrepancy")
    .description("Check that version numbers in package.json and package-lock.json match")
    .action(async () => {
      console.info("Checking for package.json and package-lock.json discrepancies...");
      const { version: packageVersion } = JSON.parse(
        await readFile(path.resolve(process.cwd(), "package.json"), "utf-8"),
      );
      const { version: packageLockVersion } = JSON.parse(
        await readFile(path.resolve(process.cwd(), "package-lock.json"), "utf-8"),
      );
      if (packageVersion !== packageLockVersion) {
        console.error(
          `${ERROR_PREFIX} package.json and package-lock.json out of sync. Please run \`npm install\` to fix this.`,
        );
        process.exitCode = 1;
        return;
      }
      console.info("package.json and package-lock.json versions in sync.");
    });
}

export default checkLockfileVersionDiscrepancy;
