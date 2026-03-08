function createMarkdownComment(comment: string): string {
  if (comment.startsWith("<!--") && comment.endsWith("-->")) {
    return comment;
  }
  return `<!-- ${comment} -->`;
}

export default createMarkdownComment;
