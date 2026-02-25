import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/cli/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    fixedExtension: false,
  },
  {
    entry: ["src/configs/index.ts"],
    outDir: "dist/configs",
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    fixedExtension: false,
  },
  {
    entry: ["src/configs/internal/index.ts"],
    outDir: "dist/configs/internal",
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    fixedExtension: false,
  },
]);
