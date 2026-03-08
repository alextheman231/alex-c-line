import getMarkdownComment from "src/utility/markdownTemplates/getMarkdownComment";

function getMarkdownCommentPair(comment: string): [string, string] {
  return [getMarkdownComment(`${comment}-start`), getMarkdownComment(`${comment}-end`)];
}

export default getMarkdownCommentPair;
