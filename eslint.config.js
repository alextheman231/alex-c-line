import plugin from "@alextheman/eslint-plugin";

export default [
  ...plugin.configs["combined/typescript"],
  ...plugin.configs["personal/javascript"],
  ...plugin.configs["personal/alex-c-line"],
];
