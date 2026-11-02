import { parseIntStrict } from "@alextheman/utility";

import upsertAlexCLineGlobalConfig from "src/services/configs/upsertAlexCLineGlobalConfig";
import { ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY } from "src/utility/constants/envPaths";
import readdirSafe from "src/utility/fileSystem/readdirSafe";

async function runMigrations(migrationMapping: Record<number, () => Promise<void>>) {
  let configDirectory = await readdirSafe(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY);

  if (configDirectory === undefined) {
    await upsertAlexCLineGlobalConfig({});
    configDirectory = await readdirSafe(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY);
  }

  const filenames = new Set(
    configDirectory?.map((entry) => {
      return entry.name;
    }) ?? [],
  );

  for (const stringIndex in migrationMapping) {
    const index = parseIntStrict(stringIndex);

    if (!filenames.has(`${index}.json`) && filenames.has(`${index - 1}.json`)) {
      const migrationFunction = migrationMapping[index];
      await migrationFunction();
      filenames.add(`${index}.json`);
    }
  }
}

export default runMigrations;
