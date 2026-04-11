import type { Command } from "commander";

import preCommit from "src/cli/commands/root/pre-commit/pre-commit";
import sayHello from "src/cli/commands/root/say-hello";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function root(program: Command) {
  loadCommands(program, {
    preCommit,
    sayHello,
  });
}

export default root;
