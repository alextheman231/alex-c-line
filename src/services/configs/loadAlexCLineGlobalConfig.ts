import type { OptionalOnCondition } from "@alextheman/utility";

import type { AlexCLineGlobalConfig } from "src/models/configs/AlexCLineGlobalConfig";

import { CodeError } from "@alextheman/utility/v6";

import { parseAlexCLineGlobalConfig } from "src/models/configs/AlexCLineGlobalConfig";
import getAlexCLineGlobalConfigPath from "src/services/configs/getAlexCLineGlobalConfigPath";
import readJsonFile from "src/utility/fileSystem/readJsonFile";

interface LoadAlexCLineGlobalConfigOptions<Strict extends boolean> {
  strict?: Strict;
}

async function loadAlexCLineGlobalConfig<Strict extends boolean = true>(
  options?: LoadAlexCLineGlobalConfigOptions<Strict>,
): Promise<OptionalOnCondition<Strict, AlexCLineGlobalConfig | null>> {
  const result = await readJsonFile(await getAlexCLineGlobalConfigPath());

  const strictModeEnabled = options?.strict ?? true;

  try {
    return result === null ? null : parseAlexCLineGlobalConfig(result);
  } catch (error) {
    if (CodeError.checkWithCode(error, "ZOD_ERROR") && !strictModeEnabled) {
      return undefined as OptionalOnCondition<Strict, AlexCLineGlobalConfig | null>;
    }
    throw error;
  }
}

export default loadAlexCLineGlobalConfig;
