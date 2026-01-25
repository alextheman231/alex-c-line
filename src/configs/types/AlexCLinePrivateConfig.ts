import type { PackageManager } from "src/configs/types/PreCommitConfig";

export interface LocalPackage<ScriptName extends string = string> {
  /** The name of the package manager being used (can choose from `npm` or `pnpm`). If not provided, can be inferred from the packageManager field in package.json. */
  packageManager: PackageManager;
  /** The name of the script to prepare the local package (defaults to `create-local-package`). */
  prepareScript?: ScriptName;
  /** The path to the local package repository. */
  path: string;
}

export interface UseLocalPackageConfig<ScriptName extends string = string> {
  /** A record of all packages that we may want to consider using locally. */
  localPackages: Record<string, LocalPackage<ScriptName>>;
}

export interface AlexCLinePrivateConfig<ScriptName extends string = string> {
  useLocalPackage: UseLocalPackageConfig<ScriptName>;
}
