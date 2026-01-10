import type { Command } from "commander";

import sodium from "libsodium-wrappers";

function encrypt(program: Command) {
  program
    .command("encrypt")
    .description("Encrypt a secret given the public key and the thing you want to encrypt.")
    .argument("<key>", "The public key to encrypt with")
    .argument("<value>", "The value to encrypt in plaintext")
    .action(async (key: string, value: string) => {
      try {
        await sodium.ready;

        const base64Key = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);

        const encryptedValue = sodium.crypto_box_seal(value, base64Key);

        const encryptedBase64Value = sodium.to_base64(
          encryptedValue,
          sodium.base64_variants.ORIGINAL,
        );

        console.info(encryptedBase64Value);
      } catch {
        program.error(
          "Encryption failed. Please double-check that the given key is a valid base 64 string.",
          { exitCode: 1, code: "ENCRYPTION_FAILED" },
        );
      }
    });
}

export default encrypt;
