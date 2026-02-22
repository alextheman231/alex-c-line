import z from "zod";

export const alexCLineGlobalCacheSchema = z.looseObject({
  updateChecks: z.record(z.string(), z.string()).optional(),
});

export type AlexCLineGlobalCache = z.infer<typeof alexCLineGlobalCacheSchema>;
