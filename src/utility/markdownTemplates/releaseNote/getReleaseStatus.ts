import { DataError, parseZodSchema } from "@alextheman/utility";
import z from "zod";

import getMarkdownBlock from "src/utility/markdownTemplates/getMarkdownBlock";
import normaliseMarkdown from "src/utility/markdownTemplates/normaliseMarkdown";
import { ReleaseStatus } from "src/utility/markdownTemplates/releaseNote/types/ReleaseStatus";

function getReleaseStatus(content: string): ReleaseStatus {
  const releaseStatus = getMarkdownBlock(
    content,
    "<!-- alex-c-line-start-release-status -->",
    "<!-- alex-c-line-end-release-status -->",
  );

  if (releaseStatus === null) {
    throw new DataError(
      { releaseStatus },
      "RELEASE_STATUS_NOT_FOUND",
      "Could not find release status in document.",
    );
  }

  return parseZodSchema(z.enum(ReleaseStatus), normaliseMarkdown(releaseStatus.split(":")[1]));
}

export default getReleaseStatus;
