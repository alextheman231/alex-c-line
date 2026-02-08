function getMarkdownBlock(content: string, startMarker: string, endMarker: string): string | null {
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return null;
  }

  return content.slice(startIndex + startMarker.length, endIndex).trim();
}

export default getMarkdownBlock;
