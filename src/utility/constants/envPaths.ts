import envPaths from "env-paths";

import path from "node:path";

import CURRENT_CONFIG_VERSION from "src/configs/migrations/CURRENT_CONFIG_VERSION";

export const alexCLineEnvPaths = envPaths("alex-c-line");
export const {
  cache: ALEX_C_LINE_GLOBAL_CACHE_DIRECTORY,
  config: ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY,
} = alexCLineEnvPaths;
export const ALEX_C_LINE_GLOBAL_CACHE_PATH: string = path.join(
  ALEX_C_LINE_GLOBAL_CACHE_DIRECTORY,
  "cache.json",
);
export const ALEX_C_LINE_GLOBAL_CONFIG_PATH = path.join(
  ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY,
  `${CURRENT_CONFIG_VERSION}.json`,
);
