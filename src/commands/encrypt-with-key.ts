import type { Command } from "commander";

import { encryptWithKey as encryptWithKeyUtility } from "@alextheman/utility";

function encryptWithKey(program: Command) {
  program
    .command("encrypt-with-key")
    .alias("encrypt")
    .description("Encrypt a secret given the public base64 key and the thing you want to encrypt.")
    .argument("<publicKey>", "The public base64 key to encrypt with")
    .argument("<plaintextValue>", "The value to encrypt in plaintext")
    .action(async (publicKey: string, plaintextValue: string) => {
      try {
        console.info(await encryptWithKeyUtility(publicKey, plaintextValue));
      } catch {
        program.error(
          "Encryption failed. Please double-check that the given key is a valid base 64 string.",
          { exitCode: 1, code: "ENCRYPTION_FAILED" },
        );
      }
    });
}

export default encryptWithKey;
