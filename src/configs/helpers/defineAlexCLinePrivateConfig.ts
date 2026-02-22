import type { AlexCLinePrivateConfig } from "src/configs/types/AlexCLinePrivateConfig";

import { parseZodSchema } from "@alextheman/utility";
import { PackageManager } from "@alextheman/utility/internal";
import z from "zod";

import { DependencyGroup } from "src/configs/types";

export const alexCLinePrivateConfigSchema = z.object({
  useLocalPackage: z.strictObject({
    enableCache: z.boolean().optional(),
    localPackages: z.record(
      z.string(),
      z.strictObject({
        packageManager: z.enum(PackageManager),
        path: z.string(),
        prepareScript: z.string().optional(),
        dependencyGroup: z.enum(DependencyGroup).optional(),
        keepOldTarballs: z.boolean().optional(),
      }),
    ),
  }),
});

export function parseAlexCLinePrivateConfig(data: unknown): AlexCLinePrivateConfig {
  return parseZodSchema(alexCLinePrivateConfigSchema, data);
}

function defineAlexCLinePrivateConfig(config: AlexCLinePrivateConfig): AlexCLinePrivateConfig {
  return config;
}

export default defineAlexCLinePrivateConfig;
