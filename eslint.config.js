import plugin from "@alextheman/eslint-plugin";

export default [
  ...plugin.configs["internal/alex-c-line"],
  ...plugin.configs["general/package-json"],
];
