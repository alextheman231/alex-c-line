import type { Command } from "commander";

import { DataError, normaliseIndents, parseZodSchema } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

import path from "node:path";

import { PrivateConfigFileName } from "src/configs/types/ConfigFileName";
import loadAlexCLinePrivateConfig from "src/utility/configLoaders/loadAlexCLinePrivateConfig";
import experimentalHeader from "src/utility/constants/experimentalHeader";
import findAlexCLineConfig from "src/utility/findAlexCLineConfig";
import findTgzFile from "src/utility/findTgzFile";
import getPackageJsonContents from "src/utility/getPackageJsonContents";
import removeAllTarballs from "src/utility/removeAllTarballs";

function useLocalPackage(program: Command) {
  program
    .command("use-local-package")
    .description(
      normaliseIndents`
      ${experimentalHeader}
      
      Prepare and use a local version of a given package.`,
    )
    .argument("<packageName>", "The name of the package to use locally.")
    .option("--reverse", "Reverse back to the live version of the package", false)
    .argument("[args...]", "Extra arguments to pass if local package name is alex-c-line")
    .action(async (packageName, args, { reverse }) => {
      const configPath = await findAlexCLineConfig(process.cwd(), [
        PrivateConfigFileName.COMMON_JS_JAVASCRIPT,
        PrivateConfigFileName.ES_MODULES_JAVASCRIPT,
        PrivateConfigFileName.STANDARD_JAVASCRIPT,
      ]);

      if (!configPath) {
        program.error(
          "Could not find the path to the alex-c-line private config file (should be `.alex-c-line.private.config.js`). Does it exist?",
          {
            exitCode: 1,
            code: "ALEX_C_LINE_PRIVATE_CONFIG_NOT_FOUND",
          },
        );
      }

      const {
        useLocalPackage: { localPackages },
      } = await loadAlexCLinePrivateConfig(configPath);

      const localPackage = localPackages[packageName];
      if (!localPackage) {
        throw new DataError(
          { packageName, configPath },
          "PACKAGE_NOT_FOUND",
          `Could not find ${packageName} in your private config.`,
        );
      }

      const {
        packageManager,
        prepareScript = "build",
        dependencyGroup = "dependencies",
        keepOldTarballs,
      } = localPackage;

      const packageInfo = await getPackageJsonContents(process.cwd());

      if (packageInfo === null) {
        throw new DataError(
          { currentDirectory: process.cwd() },
          "MISSING_CURRENT_REPOSITORY_PACKAGE_JSON",
          "Could not find package.json in the current location",
        );
      }

      const dependencies = {
        dependencies: parseZodSchema(z.record(z.string(), z.string()), packageInfo.dependencies),
        devDependencies: parseZodSchema(
          z.record(z.string(), z.string()),
          packageInfo.devDependencies,
        ),
      }[dependencyGroup];

      if (!dependencies[packageName] && packageName !== "alex-c-line") {
        throw new DataError(
          { packageName, dependencyGroup, packagePath: process.cwd() },
          "PACKAGE_NOT_FOUND",
          `Could not find ${packageName} in the ${dependencyGroup} of your package.json.`,
        );
      }

      const localPackageFullPath = path.resolve(process.cwd(), localPackage.path);

      const localPackageInfo = await getPackageJsonContents(localPackageFullPath);

      if (localPackageInfo === null) {
        throw new DataError(
          { localPackageFullPath },
          "MISSING_PACKAGE_REPOSITORY_PACKAGE_JSON",
          "Could not find package.json in the package repository.",
        );
      }

      const localPackageRepositoryName = parseZodSchema(z.string(), localPackageInfo.name);

      if (localPackageRepositoryName !== packageName) {
        throw new DataError(
          {
            providedPackageName: packageName,
            localPackagePath: localPackageFullPath,
            localPackageRepositoryName,
          },
          "PACKAGE_NAME_MISMATCH",
          "The `name` field in package repository does not match the package name provided.",
        );
      }

      if (packageName === "alex-c-line") {
        await execa({ cwd: localPackageFullPath })`${packageManager} run ${prepareScript}`;
        console.info(`Command output from ${localPackageFullPath}:`);
        await execa(
          process.execPath,
          [path.join(localPackageFullPath, "dist", "index.js"), ...args],
          {
            cwd: process.cwd(),
            stdio: "inherit",
          },
        );
      } else {
        if (!reverse) {
          await execa({
            cwd: localPackageFullPath,
          })`${packageManager} run ${prepareScript}`;
          if (!keepOldTarballs) {
            await removeAllTarballs(localPackageFullPath, packageName);
          }
          await execa({
            cwd: localPackageFullPath,
          })`${packageManager} pack`;
        }

        await execa({
          cwd: process.cwd(),
          stdio: "inherit",
        })`${packageManager} uninstall ${packageName}`;
        await execa(
          packageManager,
          [
            "install",
            dependencyGroup === "devDependencies" ? "--save-dev" : undefined,
            reverse
              ? packageName
              : `file:${path.join(localPackageFullPath, await findTgzFile(localPackageFullPath, packageManager))}`,
          ].filter((arg) => {
            return arg !== undefined;
          }),
          { cwd: process.cwd(), stdio: "inherit" },
        );
      }
    });
}

export default useLocalPackage;
