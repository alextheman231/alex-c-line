declare module "dotenv-stringify" {
  const stringify: (obj: Record<string, unknown>) => string;
  export default stringify;
}

declare module "commander" {
  export * from "@commander-js/extra-typings";
}
