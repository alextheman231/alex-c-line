import { az } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import matter from "gray-matter";
import z from "zod";

function replaceMarkdownPlaceholders(
  rawContent: string,
  templateVariables: Record<string, string>,
): string {
  const { content, data } = matter(rawContent);

  const placeholders = az.with(z.array(z.string()).default([])).parse(data.placeholders);

  let finalContent = content;
  for (const placeholder of placeholders) {
    if (!(placeholder in templateVariables)) {
      throw new DataError(
        { placeholder },
        "INVALID_PLACEHOLDER",
        "The placeholder found in frontmatter can not be found in the metadata.",
      );
    }

    finalContent = finalContent.replaceAll(`{{${placeholder}}}`, templateVariables[placeholder]);
  }
  return finalContent;
}

export default replaceMarkdownPlaceholders;
