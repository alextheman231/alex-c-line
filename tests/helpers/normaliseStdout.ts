import { DataError } from "@alextheman/utility/v6";

function normaliseStdout(
  stdout: string | Array<string> | Array<unknown> | Uint8Array<ArrayBufferLike> | undefined | null,
): string {
  if (stdout === undefined || stdout === null) {
    throw new DataError({ stdout }, "NO_STDOUT", "No stdout returned.");
  }

  if (typeof stdout === "string") {
    return stdout;
  }

  if (Array.isArray(stdout)) {
    return stdout.map(String).join("\n");
  }

  if (stdout instanceof Uint8Array) {
    return Buffer.from(stdout).toString("utf8");
  }

  throw new DataError(
    stdout,
    "UNSUPPORTED_STDOUT",
    "Unsupported stdout type returned from command.",
  );
}

export default normaliseStdout;
