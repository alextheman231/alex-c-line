import type { Command } from "commander";

import { execa } from "execa";

function outdatedDependencies(program: Command) {
  program.command("outdated-dependencies").action(async () => {
    const { exitCode, stdout, stderr } = await execa({ reject: false })`pnpm outdated`;
    if (!([0, 1] as (number | undefined)[]).includes(exitCode)) {
      program.error(stderr ?? stdout, {
        exitCode,
        code: "PNPM_OUDATED_ERROR",
      });
    }
    console.info(stdout);
  });
}

export default outdatedDependencies;
