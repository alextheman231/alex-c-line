import type { Command } from "commander";

import { getDependenciesFromGroup, getPackageJsonContents } from "@alextheman/utility/internal";

import ERROR_PREFIX from "src/utility/constants/ERROR_PREFIX";
import SUCCESS_PREFIX from "src/utility/constants/SUCCESS_PREFIX";

export interface PackageDependencies {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function findFileDependencies(
  dependencies: Record<string, string> | undefined,
): Record<string, string> {
  const fileDependencies: Record<string, string> = {};
  if (!dependencies) {
    return {};
  }
  for (const dependency in dependencies) {
    if (dependencies[dependency].includes("file:")) {
      fileDependencies[dependency] = dependencies[dependency];
    }
  }
  return fileDependencies;
}

async function noFileDependencies(program: Command) {
  console.info("Checking for file dependencies...");
  const packageInfo = await getPackageJsonContents(process.cwd());

  const dependencies = getDependenciesFromGroup(packageInfo, "dependencies");
  const devDependencies = getDependenciesFromGroup(packageInfo, "devDependencies");

  const allFileDependencies: PackageDependencies = {
    dependencies: findFileDependencies(dependencies),
    devDependencies: findFileDependencies(devDependencies),
  };

  if (Object.keys(allFileDependencies.dependencies ?? {}).length === 0) {
    delete allFileDependencies.dependencies;
  }
  if (Object.keys(allFileDependencies.devDependencies ?? {}).length === 0) {
    delete allFileDependencies.devDependencies;
  }

  if (Object.keys(allFileDependencies).length !== 0) {
    program.error(
      `${ERROR_PREFIX} File dependencies found:\n\n${JSON.stringify(allFileDependencies, undefined, 2)}
          `,
      { exitCode: 2, code: "FILE_DEPENDENCIES_FOUND" },
    );
  }
  console.info(`${SUCCESS_PREFIX} No file dependencies found!`);
}

export default noFileDependencies;
