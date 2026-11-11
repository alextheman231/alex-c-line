import { getDependenciesFromGroup, getPackageJsonContents } from "@alextheman/utility/internal";

import SUCCESS_PREFIX from "src/utility/constants/SUCCESS_PREFIX";
import UserError from "src/utility/errors/UserError";
import stringifyJSON from "src/utility/miscellaneous/stringifyJSON";

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

async function noFileDependencies() {
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
    throw new UserError(
      "FILE_DEPENDENCIES_FOUND",
      `File dependencies found:\n\n${stringifyJSON(allFileDependencies)}`,
    );
  }
  console.info(`${SUCCESS_PREFIX} No file dependencies found!`);
}

export default noFileDependencies;
