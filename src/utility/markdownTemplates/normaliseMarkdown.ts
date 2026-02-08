function normaliseMarkdown(markdownString: string): string {
  return markdownString
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => {
      return line.trim();
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

export default normaliseMarkdown;
