import type { Command } from "commander";

import { normaliseIndents, VersionNumber, VersionType } from "@alextheman/utility";

import { mkdir, readdir, rename, rmdir } from "node:fs/promises";
import path from "node:path";

function migrateReleaseNotes(program: Command) {
  program
    .command("migrate-release-notes")
    .description(
      normaliseIndents`
        Migrate the docs/releases folder generated from \`create-release-note\` to be more compatible with v2.
        The release documents will now be structured as docs/releases/vX/vX.Y/vX.Y.Z.md, rather than docs/releases/<major|minor|patch>/vX.Y.Z`,
    )
    .option("--dry-run", "Perform a dry run of the migration without changing any files.")
    .action(async ({ dryRun }) => {
      if (dryRun) {
        console.info("Running migration in dry-run mode. Existing files will not be altered.");
        console.info();
      }
      const oldReleasesPath = path.join(process.cwd(), "docs", "releases");
      const oldReleasesDirectory = await readdir(oldReleasesPath);

      const versionTypes = Object.values(VersionType).filter((value) => {
        return oldReleasesDirectory.includes(value);
      });

      let filesMovedCount: number = 0;
      for (const versionType of versionTypes) {
        const versionPath = path.join(oldReleasesPath, versionType);
        const fileNames = await readdir(versionPath);

        const versionNumbers = fileNames
          .filter((fileName) => {
            return fileName.endsWith(".md");
          })
          .map((fileName) => {
            const fileNameNoExtension = fileName.slice(0, -3);
            try {
              return new VersionNumber(fileNameNoExtension);
            } catch {
              // Swallow the error - it means the version number is not valid but we want it to skip invalid version numbers instead.
            }
          })
          .filter((item) => {
            return item !== undefined;
          });

        for (const versionNumber of versionNumbers) {
          const oldFilePath = path.join(versionPath, `${versionNumber}.md`);

          const newFilePath = path.join(
            oldReleasesPath,
            `v${versionNumber.major}`,
            `v${versionNumber.major}.${versionNumber.minor}`,
            `${versionNumber}.md`,
          );

          const relativeOldFilePath = path.relative(process.cwd(), oldFilePath);
          const relativeNewFilePath = path.relative(process.cwd(), newFilePath);

          if (dryRun) {
            console.info(`Would move \`${relativeOldFilePath}\` to \`${relativeNewFilePath}\``);
          } else {
            await mkdir(path.dirname(newFilePath), { recursive: true });
            await rename(oldFilePath, newFilePath);
            console.info(`Moved \`${relativeOldFilePath}\` to \`${relativeNewFilePath}\``);
          }
          filesMovedCount++;
        }
      }

      console.info();
      if (!dryRun) {
        for (const oldFolderName of versionTypes) {
          const oldFolderPath = path.join(oldReleasesPath, oldFolderName);
          const relativeOldFolderPath = path.relative(process.cwd(), oldFolderPath);
          const oldFolderContents = await readdir(oldFolderPath);
          if (oldFolderContents.length === 0) {
            await rmdir(oldFolderPath);
            console.info(
              `All files from \`${relativeOldFolderPath}\` removed. Deleting \`${relativeOldFolderPath}\`.`,
            );
          }
        }
      }

      console.info();
      console.info(
        dryRun
          ? `Dry run complete! ${filesMovedCount} files would be moved.`
          : `Migration complete! ${filesMovedCount} files moved.`,
      );
    });
}

export default migrateReleaseNotes;
