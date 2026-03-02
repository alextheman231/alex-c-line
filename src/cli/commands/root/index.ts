import type { Command } from "commander";

import artwork from "src/cli/commands/root/artwork";
import encryptWithKey from "src/cli/commands/root/encrypt-with-key";
import preCommit from "src/cli/commands/root/pre-commit/pre-commit";
import sayHello from "src/cli/commands/root/say-hello";
import useLocalPackage from "src/cli/commands/root/use-local-package";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function root(program: Command) {
  loadCommands(program, {
    artwork,
    encryptWithKey,
    preCommit,
    sayHello,
    useLocalPackage,
  });
}

export default root;
