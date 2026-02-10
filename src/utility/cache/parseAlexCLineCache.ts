import { parseZodSchema, VersionNumber } from "@alextheman/utility";
import z from "zod";

import { DependencyGroup } from "src/configs";

const alexCLineCacheSchema = z
  .object({
    useLocalPackage: z
      .object({
        dependencies: z.record(
          z.string(),
          z.object({
            currentVersion: z.string(),
            previousVersion: z
              .union([z.instanceof(VersionNumber), z.string()])
              .transform((value) => {
                return value instanceof VersionNumber
                  ? value.toString({ omitPrefix: true })
                  : value;
              }),
            dependencyGroup: z.enum(DependencyGroup),
          }),
        ),
      })
      .partial(),
  })
  .partial();
export type AlexCLineCache = z.infer<typeof alexCLineCacheSchema>;

function parseAlexCLineCache(data: unknown): AlexCLineCache {
  return parseZodSchema(alexCLineCacheSchema, data);
}

export default parseAlexCLineCache;
