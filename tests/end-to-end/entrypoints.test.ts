import type { CreateEnumType } from "@alextheman/utility";

import { normaliseIndents, parseBoolean } from "@alextheman/utility";
import {
  getPackageJsonContents,
  getPackageJsonPath,
  packageJsonNotFoundError,
  PackageManager,
  setupPackageEndToEnd,
} from "@alextheman/utility/internal";
import { temporaryDirectoryTask } from "tempy";
import { describe as describeVitest, expect, test } from "vitest";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import doesFileExist from "src/utility/fileSystem/doesFileExist";
import createAlexCLineArtwork from "src/utility/miscellaneous/createAlexCLineArtwork";

import packageInfo from "package.json" with { type: "json" };

const Entrypoint = {
  ROOT: "alex-c-line",
  CONFIGS: "alex-c-line/configs",
  CONFIGS_INTERNAL: "alex-c-line/configs/internal",
} as const;
type Entrypoint = CreateEnumType<typeof Entrypoint>;

const describe = parseBoolean(process.env.RUN_END_TO_END ?? "false")
  ? describeVitest
  : describeVitest.skip;

function getAlexCLineConfig(
  entrypoint: Exclude<Entrypoint, typeof Entrypoint.ROOT>,
  packageManager: PackageManager,
) {
  const exported = {
    [Entrypoint.CONFIGS]: normaliseIndents`
      defineAlexCLineConfig({ 
        preCommit: {
          packageManager: "${packageManager}",
          updateIndex: false,
          steps: ["artwork"]
        }
      })
    `,
    [Entrypoint.CONFIGS_INTERNAL]: "testConfig",
  }[entrypoint];

  return normaliseIndents`
    import { ${entrypoint === Entrypoint.CONFIGS ? "defineAlexCLineConfig" : "testConfig"} } from "${entrypoint}";

    export default ${exported}
  `;
}

describe.each<Entrypoint>([Entrypoint.ROOT, Entrypoint.CONFIGS, Entrypoint.CONFIGS_INTERNAL])(
  "Entrypoint %s",
  (entrypoint) => {
    describe.each<PackageManager>(["npm", "pnpm"])("Package manager %s", (packageManager) => {
      test(
        entrypoint === Entrypoint.ROOT
          ? "Can run the command-line from a package.json script"
          : "Can import the configs",
        async () => {
          await temporaryDirectoryTask(async (temporaryPath) => {
            const runCommandInTempDirectory = await setupPackageEndToEnd(
              temporaryPath,
              packageManager,
              "module",
            );
            expect(
              await doesFileExist(path.join(temporaryPath, "node_modules", ".bin", "alex-c-line")),
            ).toBe(true);

            const testPackageInfo = await getPackageJsonContents(temporaryPath);

            if (testPackageInfo === null) {
              throw packageJsonNotFoundError(temporaryPath);
            }

            testPackageInfo.scripts = {
              ...(testPackageInfo.scripts ?? {}),
              artwork: "alex-c-line artwork",
              "pre-commit": "alex-c-line pre-commit-2",
            };

            if (packageManager === PackageManager.PNPM) {
              testPackageInfo.pnpm = packageInfo.pnpm;
            }

            await writeFile(
              getPackageJsonPath(temporaryPath),
              JSON.stringify(testPackageInfo, null, 2),
            );

            if (packageManager === PackageManager.PNPM) {
              await runCommandInTempDirectory`pnpm install`;
            }

            if (entrypoint === Entrypoint.ROOT) {
              const { exitCode, stdout: artwork } =
                await runCommandInTempDirectory`${packageManager} run artwork`;
              expect(exitCode).toBe(0);
              expect(artwork).toContain(await createAlexCLineArtwork());
            } else {
              const alexCLineConfigContents = getAlexCLineConfig(entrypoint, packageManager);
              await writeFile(
                path.join(temporaryPath, "alex-c-line.config.js"),
                alexCLineConfigContents,
              );

              const { exitCode, stdout: artwork } =
                await runCommandInTempDirectory`${packageManager} run pre-commit`;
              expect(exitCode).toBe(0);
              expect(artwork).toContain(await createAlexCLineArtwork());
            }
          });
        },
        30000,
      );
    });
  },
);
