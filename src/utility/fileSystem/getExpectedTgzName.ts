import { DataError, parseZodSchema } from "@alextheman/utility";
import { execa } from "execa";
import z from "zod";

import parseJsonFromStdout from "src/utility/miscellaneous/parseJSONFromStdout";

async function getExpectedTgzName(packagePath: string, packageManager: string) {
  const { stdout: rawPackedTgzData } = await execa({
    cwd: packagePath,
  })`${packageManager} pack --json --dry-run`;
  const packedTgzData = parseJsonFromStdout(rawPackedTgzData);
  const parsedPackedTgzData = parseZodSchema(
    packageManager === "pnpm"
      ? z.object({ filename: z.string() })
      : z.array(z.object({ filename: z.string() })),
    packedTgzData,
    new DataError(
      packedTgzData,
      "AMBIGUOUS_EXPECTED_FILE_NAME",
      "Could not figire out the expected filename.",
    ),
  );

  const [normalisedTgzMetadata] = Array.isArray(parsedPackedTgzData)
    ? parsedPackedTgzData
    : [parsedPackedTgzData];
  const { filename: expectedTgzFileName } = normalisedTgzMetadata;

  return expectedTgzFileName;
}

export default getExpectedTgzName;
