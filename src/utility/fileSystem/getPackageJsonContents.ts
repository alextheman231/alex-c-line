import { readFile } from "node:fs/promises";
import path from "node:path";

async function getPackageJsonContents(directory: string): Promise<Record<string, any> | null> {
  try {
    return JSON.parse(
      await readFile(
        path.resolve(
          ...(directory.endsWith("package.json") ? [directory] : [directory, "package.json"]),
        ),
        "utf-8",
      ),
    );
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export default getPackageJsonContents;
