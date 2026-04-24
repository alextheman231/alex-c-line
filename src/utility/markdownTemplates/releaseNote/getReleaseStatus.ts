import { az } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import z from "zod";

import getMarkdownBlock from "src/utility/markdownTemplates/getMarkdownBlock";
import getMarkdownCommentPair from "src/utility/markdownTemplates/getMarkdownCommentPair";
import normaliseMarkdown from "src/utility/markdownTemplates/normaliseMarkdown";
import { ReleaseStatus } from "src/utility/markdownTemplates/releaseNote/types/ReleaseStatus";

function getReleaseStatus(content: string): ReleaseStatus {
  const releaseStatus = getMarkdownBlock(
    content,
    ...getMarkdownCommentPair("alex-c-line-release-status"),
  );

  if (releaseStatus === null) {
    throw new DataError(
      { releaseStatus },
      "RELEASE_STATUS_NOT_FOUND",
      "Could not find release status in document.",
    );
  }

  return az.with(z.enum(ReleaseStatus)).parse(normaliseMarkdown(releaseStatus.split(":")[1]));
}

export default getReleaseStatus;
