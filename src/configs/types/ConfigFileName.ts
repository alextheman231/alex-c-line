import type { CreateEnumType } from "@alextheman/utility";

export const ConfigFileName = {
  STANDARD_JAVASCRIPT: "alex-c-line.config.js",
  ES_MODULES_JAVASCRIPT: "alex-c-line.config.mjs",
  COMMON_JS_JAVASCRIPT: "alex-c-line.config.cjs",
} as const;

export type ConfigFileName = CreateEnumType<typeof ConfigFileName>;

export const PrivateConfigFileName = {
  STANDARD_JAVASCRIPT: ".alex-c-line.private.config.js",
  ES_MODULES_JAVASCRIPT: ".alex-c-line.private.config.mjs",
  COMMON_JS_JAVASCRIPT: ".alex-c-line.private.config.cjs",
};

export type PrivateConfigFileName = CreateEnumType<typeof PrivateConfigFileName>;
