import { readdir, rm } from "node:fs/promises";
import path from "node:path";

async function removeAllTarballs(packagePath: string, packageName: string): Promise<void> {
  const prefix = `${(packageName.startsWith("@") ? packageName.slice(1) : packageName).replaceAll("/", "-")}-`;

  const files = await readdir(packagePath);
  const matches = files.filter((file) => {
    return file.startsWith(prefix) && file.endsWith(".tgz");
  });

  await Promise.all(
    matches.map((file) => {
      return rm(path.join(packagePath, file), { force: true });
    }),
  );
}

export default removeAllTarballs;
