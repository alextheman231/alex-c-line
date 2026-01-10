import { ExecaError } from "execa";
import sodium from "libsodium-wrappers";
import { beforeAll, describe, expect, test } from "vitest";

import alexCLineTestClient from "tests/test-clients/alex-c-line-test-client";
import normaliseStdout from "tests/test-clients/normaliseStdout";

describe("encrypt", () => {
  beforeAll(async () => {
    await sodium.ready;
  });

  test("Encrypts the value and responds with the encrypted value, NOT the plaintext", async () => {
    const { publicKey, privateKey } = sodium.crypto_box_keypair();

    const publicKeyBase64 = sodium.to_base64(publicKey, sodium.base64_variants.ORIGINAL);
    const plaintextValue = "Hello world";

    const { stdout, exitCode } = await alexCLineTestClient("encrypt-with-key", [
      publicKeyBase64,
      plaintextValue,
    ]);
    expect(exitCode).toBe(0);

    const encryptedValue = normaliseStdout(stdout);
    const decryptedValue = sodium.to_string(
      sodium.crypto_box_seal_open(
        sodium.from_base64(encryptedValue, sodium.base64_variants.ORIGINAL),
        publicKey,
        privateKey,
      ),
    );

    expect(decryptedValue).toBe(plaintextValue);
    expect(encryptedValue).not.toContain(plaintextValue);
  });

  test("Returns different encrypted strings per run that still resolve to the same value", async () => {
    const { publicKey, privateKey } = sodium.crypto_box_keypair();

    const publicKeyBase64 = sodium.to_base64(publicKey, sodium.base64_variants.ORIGINAL);
    const plaintextValue = "Hello world";

    const { exitCode: firstExitCode, stdout: firstStdout } = await alexCLineTestClient(
      "encrypt-with-key",
      [publicKeyBase64, plaintextValue],
    );
    expect(firstExitCode).toBe(0);
    const firstEncryptedValue = normaliseStdout(firstStdout);
    expect(firstEncryptedValue).not.toContain(plaintextValue);

    const { exitCode: secondExitCode, stdout: secondStdout } = await alexCLineTestClient(
      "encrypt",
      [publicKeyBase64, plaintextValue],
    );
    expect(secondExitCode).toBe(0);
    const secondEncryptedValue = normaliseStdout(secondStdout);
    expect(secondEncryptedValue).not.toContain(plaintextValue);

    expect(firstEncryptedValue).not.toBe(secondEncryptedValue);

    const firstDecryptedValue = sodium.to_string(
      sodium.crypto_box_seal_open(
        sodium.from_base64(firstEncryptedValue, sodium.base64_variants.ORIGINAL),
        publicKey,
        privateKey,
      ),
    );
    const secondDecryptedValue = sodium.to_string(
      sodium.crypto_box_seal_open(
        sodium.from_base64(secondEncryptedValue, sodium.base64_variants.ORIGINAL),
        publicKey,
        privateKey,
      ),
    );

    expect(firstDecryptedValue).toBe(plaintextValue);
    expect(secondDecryptedValue).toBe(plaintextValue);
  });

  test("If any of this errors, the error message MUST NOT display the plaintext value", async () => {
    const plaintextValue = "gdfssdehrhrt";
    try {
      await alexCLineTestClient("encrypt-with-key", ["Invalid public key", plaintextValue]);
      throw new Error("DID_NOT_THROW");
    } catch (error) {
      if (error instanceof ExecaError) {
        const { exitCode, stderr: errorMessage } = error;
        expect(exitCode).toBe(1);

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
