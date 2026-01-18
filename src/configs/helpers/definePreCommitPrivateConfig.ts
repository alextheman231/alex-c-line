import type { PreCommitPrivateConfig } from "src/configs/types/PreCommitPrivateConfig";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

export const preCommitPrivateConfigSchema = z.strictObject({
  disableSteps: z.array(z.string()).optional(),
});

export function parsePreCommitPrivateConfig(input: unknown): PreCommitPrivateConfig {
  return parseZodSchema(preCommitPrivateConfigSchema, input);
}

function definePreCommitPrivateConfig<ScriptName extends string = string>(
  config: PreCommitPrivateConfig<ScriptName>,
): PreCommitPrivateConfig<ScriptName> {
  return config;
}

export default definePreCommitPrivateConfig;
