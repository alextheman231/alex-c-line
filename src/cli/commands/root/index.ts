import type { Command } from "commander";

import artwork from "src/cli/commands/root/artwork";
import editEnvFile from "src/cli/commands/root/edit-env-file";
import encryptWithKey from "src/cli/commands/root/encrypt-with-key";
import preCommit2 from "src/cli/commands/root/pre-commit/pre-commit-2";
import sayHello from "src/cli/commands/root/say-hello";
import useLocalPackage from "src/cli/commands/root/use-local-package";
import loadCommands from "src/utility/miscellaneous/loadCommands";

function root(program: Command) {
  loadCommands(program, {
    artwork,
    editEnvFile,
    encryptWithKey,
    preCommit2,
    sayHello,
    useLocalPackage,
  });
}

export default root;
