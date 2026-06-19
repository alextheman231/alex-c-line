function resolveLicense(license: string): Array<string> {
  return license
    .replaceAll(/[()]/g, "")
    .split(/\s+OR\s+/)
    .map((part) => {
      return part.trim();
    });
}

export default resolveLicense;
