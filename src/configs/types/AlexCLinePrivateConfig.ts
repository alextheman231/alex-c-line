import type { PackageManager } from "@alextheman/utility/internal";

import type { DependencyGroup } from "src/configs/types/DependencyGroup";

export interface LocalPackage<ScriptName extends string = string> {
  /** The name of the package manager being used (can choose from `npm` or `pnpm`). If not provided, can be inferred from the packageManager field in package.json. */
  packageManager: PackageManager;
  /** The name of the script to prepare the local package (defaults to `build`). */
  prepareScript?: ScriptName;
  /** The path to the local package repository. */
  path: string;
  /** The dependency group to save the package in (defaults to `dependencies`) */
  dependencyGroup?: DependencyGroup;
  /** Whether to keep old .tgz files before creating new ones (defaults to false) */
  keepOldTarballs?: boolean;
}

export interface UseLocalPackageConfig<ScriptName extends string = string> {
  /** Enable caching of the previous version number. */
  enableCache?: boolean;
  /** A record of all packages that we may want to consider using locally. */
  localPackages: Record<string, LocalPackage<ScriptName>>;
}

export interface AlexCLinePrivateConfig<ScriptName extends string = string> {
  useLocalPackage: UseLocalPackageConfig<ScriptName>;
}
