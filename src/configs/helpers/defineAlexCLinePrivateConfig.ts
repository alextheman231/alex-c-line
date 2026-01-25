import type { AlexCLinePrivateConfig } from "src/configs/types/AlexCLinePrivateConfig";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

import { PackageManager } from "src/configs/types/PreCommitConfig";

export const alexCLinePrivateConfigSchema = z.object({
  useLocalPackage: z.strictObject({
    localPackages: z.record(
      z.string(),
      z.strictObject({
        packageManager: z.enum(PackageManager),
        path: z.string(),
        prepareScript: z.string().optional(),
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
