import createMarkdownComment from "src/utility/markdownTemplates/createMarkdownComment";

function createMarkdownCommentPair(comment: string): [string, string] {
  return [createMarkdownComment(`${comment}-start`), createMarkdownComment(`${comment}-end`)];
}

export default createMarkdownCommentPair;
