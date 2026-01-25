import type { Command } from "commander";

import { execa } from "execa";

import path from "node:path";

import { PrivateConfigFileName } from "src/configs/types/ConfigFileName";
import loadAlexCLinePrivateConfig from "src/utility/configLoaders/loadAlexCLinePrivateConfig";
import findAlexCLineConfig from "src/utility/findAlexCLineConfig";

function useLocalPackage(program: Command) {
  program
    .command("use-local-package")
    .description("Prepare and use a local version of a given package.")
    .argument("<packageName>", "The name of the package to use locally.")
    .argument("[args...]", "Extra arguments to pass if local package name is alex-c-line")
    .action(async (packageName, args) => {
      const configPath = await findAlexCLineConfig(process.cwd(), [
        PrivateConfigFileName.COMMON_JS_JAVASCRIPT,
        PrivateConfigFileName.ES_MODULES_JAVASCRIPT,
        PrivateConfigFileName.STANDARD_JAVASCRIPT,
      ]);

      if (!configPath) {
        program.error(
          "Could not find the path to the alex-c-line private config file. Does it exist?",
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
        program.error("Could not find package path in your private config.", {
          exitCode: 1,
          code: "PACKAGE_NOT_FOUND",
        });
      }

      const prepareScript = localPackage.prepareScript ?? "create-local-package";
      const localPackageFullPath = path.resolve(process.cwd(), localPackage.path);

      await execa({
        cwd: localPackageFullPath,
      })`${localPackage.packageManager} run ${prepareScript}`;

      if (packageName === "alex-c-line") {
        console.info();
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
        program.error(
          "This will be the error for packages that can't be found, but as of now, alex-c-line is the only package being supported for the time being.",
          {
            exitCode: 1,
            code: "PACKAGE_NOT_FOUND",
          },
        );
      }
    });
}

export default useLocalPackage;
