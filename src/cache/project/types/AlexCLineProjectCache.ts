import { VersionNumber } from "@alextheman/utility";
import z from "zod";

import { DependencyGroup } from "src/configs";

export const alexCLineProjectCacheSchema = z
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
                return value instanceof VersionNumber ? value.format({ omitPrefix: true }) : value;
              }),
            dependencyGroup: z.enum(DependencyGroup),
          }),
        ),
      })
      .partial(),
  })
  .partial();

export type AlexCLineProjectCache = z.infer<typeof alexCLineProjectCacheSchema>;
