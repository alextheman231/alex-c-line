import { readFile } from "node:fs/promises";
import path from "node:path";

async function getPackageJson(directory: string): Promise<Record<string, string> | null> {
  try {
    return JSON.parse(
      await readFile(
        path.join(
          process.cwd(),
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

export default getPackageJson;
