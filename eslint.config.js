import alexPlugin from "@alextheman/eslint-plugin";

export default [
  ...alexPlugin.configs["internal/alex-c-line"],
  ...alexPlugin.configs["internal/package-json"],
];
