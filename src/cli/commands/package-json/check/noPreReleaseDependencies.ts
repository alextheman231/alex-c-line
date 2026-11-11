import { normaliseIndents } from "@alextheman/utility";
import {
  getDependenciesFromGroup,
  getPackageJsonContents,
  packageJsonNotFoundError,
} from "@alextheman/utility/internal";
import { minVersion, prerelease } from "semver";

import SUCCESS_PREFIX from "src/utility/constants/SUCCESS_PREFIX";
import UserError from "src/utility/errors/UserError";
import stringifyJSON from "src/utility/miscellaneous/stringifyJSON";

function isPreRelease(dependencyVersionRange: string) {
  const minimumFromRange = minVersion(dependencyVersionRange);
  return minimumFromRange !== null && prerelease(minimumFromRange) !== null;
}

async function noPreReleaseDependencies(): Promise<void> {
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
    throw new UserError(
      "UNEXPECTED_PRE_RELEASE_VERSION",
      normaliseIndents`
        Pre-release version pinning is not allowed. Found the following violations:

    ` +
        stringifyJSON({
          dependencies: preReleaseDependencies,
          devDependencies: preReleaseDevDependencies,
        }),
    );
  }

  console.info(`${SUCCESS_PREFIX} No pre-release versions found!`);
}

export default noPreReleaseDependencies;
