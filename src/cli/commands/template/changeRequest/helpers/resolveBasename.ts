function resolveBasename(basename: string) {
  return basename
    .trim()
    .replace(/[.!?/]+$/, "")
    .toLowerCase()
    .replace(/\s+/g, "_");
}

export default resolveBasename;
