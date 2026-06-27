function resolveBasename(basename: string) {
  const today = new Date();
  const datePart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return `${datePart}_${basename
    .trim()
    .replace(/[.!?/]+$/, "")
    .toLowerCase()
    .replace(/\s+/g, "_")}`;
}

export default resolveBasename;
