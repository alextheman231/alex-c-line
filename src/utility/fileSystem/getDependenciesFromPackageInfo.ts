import type { DependencyGroup } from "src/configs";

import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

function getDependenciesFromGroup(
  packageInfo: Record<string, unknown>,
  dependencyGroup: DependencyGroup,
) {
  return {
    dependencies: parseZodSchema(z.record(z.string(), z.string()), packageInfo.dependencies ?? {}),
    devDependencies: parseZodSchema(
      z.record(z.string(), z.string()),
      packageInfo.devDependencies ?? {},
    ),
  }[dependencyGroup];
}

export default getDependenciesFromGroup;
