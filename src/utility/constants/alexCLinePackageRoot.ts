import path from "node:path";
import { fileURLToPath } from "node:url";

import findPackageRoot from "src/utility/fileSystem/findPackageRoot";

const __filename = fileURLToPath(import.meta.url);

const alexCLinePackageRoot: Promise<string> = findPackageRoot(
  path.dirname(__filename),
  "alex-c-line",
);

export default alexCLinePackageRoot;
