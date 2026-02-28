import type { Command } from "commander";

import { normaliseIndents } from "@alextheman/utility";
import {
  getDependenciesFromGroup,
  getPackageJsonContents,
  packageJsonNotFoundError,
} from "@alextheman/utility/internal";
import { minVersion, prerelease } from "semver";

import errorPrefix from "src/utility/constants/errorPrefix";
import successPrefix from "src/utility/constants/successPrefix";

function isPreRelease(dependencyVersionRange: string) {
  const minimumFromRange = minVersion(dependencyVersionRange);
  return minimumFromRange !== null && prerelease(minimumFromRange) !== null;
}

async function noPreReleaseDependencies(program: Command): Promise<void> {
  const packageJson = await getPackageJsonContents(process.cwd());

  if (packageJson === null) {
    throw packageJsonNotFoundError(process.cwd());
  }

  const dependencies = getDependenciesFromGroup(packageJson, "dependencies");
  const devDependencies = getDependenciesFromGroup(packageJson, "devDependencies");

  const preReleaseDependencies: Record<string, string> = {};
  const preReleaseDevDependencies: Record<string, string> = {};

  for (const [dependencyName, dependencyVersionRange] of Object.entries(dependencies)) {
    if (isPreRelease(dependencyVersionRange)) {
      preReleaseDependencies[dependencyName] = dependencyVersionRange;
    }
  }
  for (const [dependencyName, dependencyVersionRange] of Object.entries(devDependencies)) {
    if (isPreRelease(dependencyVersionRange)) {
      preReleaseDevDependencies[dependencyName] = dependencyVersionRange;
    }
  }

  if (
    Object.keys(preReleaseDependencies).length !== 0 ||
    Object.keys(preReleaseDevDependencies).length !== 0
  ) {
    program.error(
      normaliseIndents`
            ${errorPrefix}: Pre-release version pinning is not allowed. Found the following violations:

            ${JSON.stringify(
              {
                dependencies: preReleaseDependencies,
                devDependencies: preReleaseDevDependencies,
              },
              null,
              2,
            )}
        `,
      { exitCode: 2, code: "UNEXPECTED_PRE_RELEASE_VERSION" },
    );
  }

  console.info(`${successPrefix} No pre-release versions found!`);
}

export default noPreReleaseDependencies;
