import type { VersionNumber } from "@alextheman/utility";

export function getMajorReleaseSummary(projectName: string) {
  return `This is a new major release of the \`${projectName}\` package. It has the potential to introduce breaking changes that may require a large amount of refactoring. Please read the description of changes and migration notes below for more information.`;
}

export function getMinorReleaseSummary(projectName: string) {
  return `This is a new minor release of the \`${projectName}\` package. It introduces new features and other backwards-compatible changes that should require little to no refactoring. Please read the description of changes below.`;
}

export function getPatchReleaseSummary(projectName: string) {
  return `This is a new patch release of the \`${projectName}\` package. It includes small, non-breaking changes and should require no refactoring. Please read the description of changes below.`;
}

function getReleaseSummary(projectName: string, version: VersionNumber) {
  return {
    major: getMajorReleaseSummary(projectName),
    minor: getMinorReleaseSummary(projectName),
    patch: getPatchReleaseSummary(projectName),
  }[version.type];
}

export default getReleaseSummary;
