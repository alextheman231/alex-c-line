import { az } from "@alextheman/utility";
import { parse as parseToml } from "toml";
import z from "zod";

import { readFile } from "node:fs/promises";

import SUCCESS_PREFIX from "src/utility/constants/SUCCESS_PREFIX";
import UserError from "src/utility/errors/UserError";

const pyprojectSchema = z
  .object({
    project: z.object({
      dependencies: z.array(z.string()).optional(),
    }),
    "dependency-groups": z.object({
      dev: z.array(z.string()).optional(),
    }),
  })
  .partial();

async function preferExactDependencyVersions() {
  const data = az.with(pyprojectSchema).parse(parseToml(await readFile("pyproject.toml", "utf-8")));

  const sections = [data.project?.dependencies ?? [], data["dependency-groups"]?.dev ?? []];

  const violations = [];

  for (const dependencies of sections) {
    for (const dependency of dependencies) {
      if (!dependency.includes("==")) {
        violations.push(dependency);
      }
    }
  }

  if (violations.length !== 0) {
    throw new UserError(
      "NON_EXACT_DEPENDENCIES_FOUND",
      `Non-exact dependencies found:\n\n${violations.join("\n")}`,
    );
  }

  console.info(`${SUCCESS_PREFIX} All dependencies are exactly pinned`);
}

export default preferExactDependencyVersions;
