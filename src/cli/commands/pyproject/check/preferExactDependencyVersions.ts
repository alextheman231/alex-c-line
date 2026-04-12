import type { Command } from "commander";

import { parseZodSchema } from "@alextheman/utility";
import { parse as parseToml } from "toml";
import z from "zod";

import { readFile } from "node:fs/promises";

import errorPrefix from "src/utility/constants/errorPrefix";
import successPrefix from "src/utility/constants/successPrefix";

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

async function preferExactDependencyVersions(program: Command) {
  const data = parseZodSchema(
    pyprojectSchema,
    parseToml(await readFile("pyproject.toml", "utf-8")),
  );

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
    program.error(`${errorPrefix} Non-exact dependencies found:\n\n${violations.join("\n")}`, {
      code: "NON_EXACT_DEPENDENCIES_FOUND",
      exitCode: 2,
    });
  }

  console.info(`${successPrefix} All dependencies are exactly pinned`);
}

export default preferExactDependencyVersions;
