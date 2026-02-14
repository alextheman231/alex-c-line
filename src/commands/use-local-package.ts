import type { Command } from "commander";

import { DataError, normaliseIndents, omitProperties, parseZodSchema } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

import path from "node:path";

import createAlexCLineProjectCache from "src/cache/project/createAlexCLineProjectCache";
import loadAlexCLineProjectCache from "src/cache/project/loadAlexCLineProjectCache";
import { PrivateConfigFileName } from "src/configs/types/ConfigFileName";
import findAlexCLineConfig from "src/utility/configs/findAlexCLineConfig";
import loadAlexCLinePrivateConfig from "src/utility/configs/loadAlexCLinePrivateConfig";
import experimentalHeader from "src/utility/constants/experimentalHeader";
import findTgzFile from "src/utility/fileSystem/findTgzFile";
import getDependenciesFromGroup from "src/utility/fileSystem/getDependenciesFromPackageInfo";
import getPackageJsonContents from "src/utility/fileSystem/getPackageJsonContents";
import removeAllTarballs from "src/utility/miscellaneous/removeAllTarballs";

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

      const dependencies = getDependenciesFromGroup(packageInfo, dependencyGroup);

      if (!(packageName in dependencies) && packageName !== "alex-c-line") {
        throw new DataError(
          { packageName, dependencyGroup, packagePath: process.cwd() },
          "PACKAGE_NOT_FOUND",
          `Could not find ${packageName} in the ${dependencyGroup} of your package.json.`,
        );
      }

      const localPackagePath = path.resolve(process.cwd(), localPackage.path);

      const localPackageInfo = await getPackageJsonContents(localPackagePath);

      if (localPackageInfo === null) {
        throw new DataError(
          { localPackagePath },
          "MISSING_PACKAGE_REPOSITORY_PACKAGE_JSON",
          "Could not find package.json in the package repository.",
        );
      }

      const localPackageRepositoryName = parseZodSchema(z.string(), localPackageInfo.name);

      if (localPackageRepositoryName !== packageName) {
        throw new DataError(
          {
            providedPackageName: packageName,
            localPackagePath,
            localPackageRepositoryName,
          },
          "PACKAGE_NAME_MISMATCH",
          "The `name` field in package repository does not match the package name provided.",
        );
      }

      if (packageName === "alex-c-line") {
        if (prepareScript) {
          await execa({ cwd: localPackagePath })`${packageManager} run ${prepareScript}`;
        }
        console.info(`Command output from ${localPackagePath}:`);
        const { exitCode } = await execa(
          process.execPath,
          [path.join(localPackagePath, "dist", "index.js"), ...args],
          {
            cwd: process.cwd(),
            stdio: "inherit",
            reject: false,
          },
        );

        if (exitCode !== 0 && args.length !== 0) {
          program.error("❌ ERROR: An error occurred during the local `alex-c-line` run.", {
            exitCode: 1,
            code: "LOCAL_ALEX_C_LINE_ERROR",
          });
        }
      } else {
        const cacheContents = await loadAlexCLineProjectCache();

        if (!reverse) {
          if (prepareScript) {
            await execa({
              cwd: localPackagePath,
            })`${packageManager} run ${prepareScript}`;
          }

          if (!keepOldTarballs) {
            await removeAllTarballs(localPackagePath, packageName);
          }

          await execa({
            cwd: localPackagePath,
          })`${packageManager} pack`;
        }

        const { previousVersion, dependencyGroup: cachedDependencyGroup } =
          cacheContents?.useLocalPackage?.dependencies?.[packageName] ?? {};
        const resolvedDependencyGroup = reverse
          ? (cachedDependencyGroup ?? dependencyGroup)
          : dependencyGroup;
        await execa({
          cwd: process.cwd(),
          stdio: "inherit",
        })`${packageManager} uninstall ${packageName}`;
        await execa(
          packageManager,
          [
            "install",
            resolvedDependencyGroup === "devDependencies" ? "--save-dev" : undefined,
            reverse
              ? previousVersion
                ? `${packageName}@${previousVersion}`
                : packageName
              : `file:${path.join(localPackagePath, await findTgzFile(localPackagePath, packageManager))}`,
          ].filter((arg) => {
            return arg !== undefined;
          }),
          { cwd: process.cwd(), stdio: "inherit" },
        );

        if (!reverse) {
          const packageCacheData = {
            ...(cacheContents?.useLocalPackage?.dependencies?.[packageName] ?? {}),
            previousVersion: dependencies[packageName],
            dependencyGroup,
            currentVersion: getDependenciesFromGroup(
              (await getPackageJsonContents(process.cwd())) ?? {},
              dependencyGroup,
            )[packageName],
          };
          await createAlexCLineProjectCache({
            ...(cacheContents ?? {}),
            useLocalPackage: {
              ...cacheContents?.useLocalPackage,
              dependencies: {
                ...cacheContents?.useLocalPackage?.dependencies,
                [packageName]: packageCacheData,
              },
            },
          });
        } else {
          await createAlexCLineProjectCache({
            ...(cacheContents ?? {}),
            useLocalPackage: {
              ...cacheContents?.useLocalPackage,
              dependencies: {
                ...omitProperties(cacheContents?.useLocalPackage?.dependencies ?? {}, packageName),
              },
            },
          });
        }
      }
    });
}

export default useLocalPackage;
