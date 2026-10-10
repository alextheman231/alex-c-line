import { az } from "@alextheman/utility";
import z from "zod";

export const alexCLineGlobalConfigSchema = z.object({
  enableUpdateNotifications: z.boolean(),
});
export type AlexCLineGlobalConfig = z.infer<typeof alexCLineGlobalConfigSchema>;

export function parseAlexCLineGlobalConfig(input: unknown): AlexCLineGlobalConfig {
  return az.with(alexCLineGlobalConfigSchema).parse(input);
}
export function parseAlexCLineGlobalConfigKey(input: unknown): keyof AlexCLineGlobalConfig {
  return az.with(z.keyof(alexCLineGlobalConfigSchema)).parse(input);
}
