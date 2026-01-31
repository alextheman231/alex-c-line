import { encryptWithKey } from "@alextheman/utility";
import { ExecaError } from "execa";
import sodium from "libsodium-wrappers";
import { beforeAll, describe, expect, test } from "vitest";

import alexCLineTestClient from "tests/test-clients/alex-c-line-test-client";
import normaliseStdout from "tests/test-clients/normaliseStdout";

type CommandName = "encrypt-with-key" | "encrypt";

function runTests(command: CommandName) {
  describe(command, () => {
    beforeAll(async () => {
      await sodium.ready;
    });

    test("Encrypts the value and decrypts to the same thing the utility function decrypts to", async () => {
      const { publicKey, privateKey } = sodium.crypto_box_keypair();

      const publicKeyBase64 = sodium.to_base64(publicKey, sodium.base64_variants.ORIGINAL);
      const plaintextValue = "Hello world";

      const { stdout, stderr, exitCode } = await alexCLineTestClient(command, [
        publicKeyBase64,
        plaintextValue,
      ]);
      expect(exitCode).toBe(0);
      expect(normaliseStdout(stderr)).not.toContain(plaintextValue);

      const utilityEncryptedValue = await encryptWithKey(publicKeyBase64, plaintextValue);
      const utilityDecryptedValue = sodium.crypto_box_seal_open(
        sodium.from_base64(utilityEncryptedValue, sodium.base64_variants.ORIGINAL),
        publicKey,
        privateKey,
        "text",
      );

      const commandEncryptedValue = normaliseStdout(stdout);
      expect(commandEncryptedValue).not.toContain(plaintextValue);
      const commandDecryptedValue = sodium.crypto_box_seal_open(
        sodium.from_base64(commandEncryptedValue, sodium.base64_variants.ORIGINAL),
        publicKey,
        privateKey,
        "text",
      );

      expect(utilityDecryptedValue).toBe(commandDecryptedValue);
      expect(commandDecryptedValue).toBe(plaintextValue);
    });

    test("Encrypts the value and does NOT respond with the plaintext", async () => {
      const { publicKey } = sodium.crypto_box_keypair();

      const publicKeyBase64 = sodium.to_base64(publicKey, sodium.base64_variants.ORIGINAL);
      const plaintextValue = "Hello world";

      const { stdout, stderr, exitCode } = await alexCLineTestClient(command, [
        publicKeyBase64,
        plaintextValue,
      ]);
      expect(exitCode).toBe(0);

      const encryptedValue = normaliseStdout(stdout);
      expect(normaliseStdout(stderr)).not.toContain(plaintextValue);
      expect(encryptedValue).not.toContain(plaintextValue);
    });

    test("Returns different encrypted strings per run", async () => {
      const { publicKey } = sodium.crypto_box_keypair();

      const publicKeyBase64 = sodium.to_base64(publicKey, sodium.base64_variants.ORIGINAL);
      const plaintextValue = "Hello world";

      const {
        exitCode: firstExitCode,
        stdout: firstStdout,
        stderr: firstStderr,
      } = await alexCLineTestClient(command, [publicKeyBase64, plaintextValue]);
      expect(firstExitCode).toBe(0);
      const firstEncryptedValue = normaliseStdout(firstStdout);
      expect(firstEncryptedValue).not.toContain(plaintextValue);
      expect(normaliseStdout(firstStderr)).not.toContain(plaintextValue);

      const {
        exitCode: secondExitCode,
        stdout: secondStdout,
        stderr: secondStderr,
      } = await alexCLineTestClient(command, [publicKeyBase64, plaintextValue]);
      expect(secondExitCode).toBe(0);
      const secondEncryptedValue = normaliseStdout(secondStdout);
      expect(secondEncryptedValue).not.toContain(plaintextValue);
      expect(firstEncryptedValue).not.toBe(secondEncryptedValue);
      expect(normaliseStdout(secondStderr)).not.toContain(plaintextValue);
    });

    test("If any of this errors, the error message MUST NOT display the plaintext value", async () => {
      const plaintextValue = "gdfssdehrhrt";
      try {
        await alexCLineTestClient(command, ["Invalid public key", plaintextValue]);
        throw new Error("DID_NOT_THROW");
      } catch (error) {
        if (error instanceof ExecaError) {
          const { exitCode, stderr: errorMessage, stdout } = error;
          expect(exitCode).toBe(1);

          expect(normaliseStdout(stdout)).not.toContain(plaintextValue);
          expect(errorMessage).not.toContain(plaintextValue);
          expect(errorMessage).toBe(
            "Encryption failed. Please double-check that the given key is a valid base 64 string.",
          );
        } else {
          throw error;
        }
      }
    });
  });
}

runTests("encrypt-with-key");
runTests("encrypt");
