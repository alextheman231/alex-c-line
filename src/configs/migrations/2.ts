import { az } from "@alextheman/utility";
import z from "zod";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import { ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY } from "src/utility/constants/envPaths";
import readJsonFile from "src/utility/fileSystem/readJsonFile";
import stringifyJSON from "src/utility/miscellaneous/stringifyJSON";

const globalConfigV1Schema = z.object({
  enableUpdateNotifications: z.boolean(),
});

interface GlobalConfigV2 {
  enableUpdateNotifications: boolean;
  budget: Record<string, number> | null;
}

async function migrationTwo() {
  const rawOldConfig = await readJsonFile(path.join(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY, "1.json"));
  const oldConfig = az.with(globalConfigV1Schema).parse(rawOldConfig);

  const newConfig: GlobalConfigV2 = { ...oldConfig, budget: null };

  await writeFile(
    path.join(ALEX_C_LINE_GLOBAL_CONFIG_DIRECTORY, "2.json"),
    stringifyJSON(newConfig),
  );
}

export default migrationTwo;
