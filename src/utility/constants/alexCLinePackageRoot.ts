import path from "node:path";
import { fileURLToPath } from "node:url";

import findPackageRoot from "src/utility/fileSystem/findPackageRoot";

const __filename = fileURLToPath(import.meta.url);

const ALEX_C_LINE_PACKAGE_ROOT: Promise<string> = findPackageRoot(
  path.dirname(__filename),
  "alex-c-line",
);

export default ALEX_C_LINE_PACKAGE_ROOT;
