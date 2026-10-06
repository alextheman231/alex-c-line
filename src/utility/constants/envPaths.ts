import envPaths from "env-paths";

import path from "node:path";

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
  "config.json",
);
