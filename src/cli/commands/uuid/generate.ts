import type { Command } from "commander";

import { randomUUID } from "node:crypto";

function generateUUID(program: Command) {
  program
    .command("generate")
    .description("Generate a random UUID")
    .action(() => {
      console.info(randomUUID());
    });
}

export default generateUUID;
