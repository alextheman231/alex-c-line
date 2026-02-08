import { DataError } from "@alextheman/utility";
import { describe, expect, test } from "vitest";

import getPullRequestTemplatesFromMarkdown from "src/utility/markdownTemplates/pullRequest/getPullRequestTemplatesFromMarkdown";

describe("getPullRequestTemplatesFromMarkdown", () => {
  test("Gets the correct templates", async () => {
    const allGeneralTemplates = await getPullRequestTemplatesFromMarkdown({
      category: "general",
      projectName: "Test project",
      projectType: "package",
    });
    const expectedGeneralTemplates = [
      "pull_request_template",
      "breaking_change",
      "new_feature",
      "bug_fix",
      "tooling_change",
      "documentation_change",
      "refactor",
      "miscellaneous",
    ];
    expect(Object.keys(allGeneralTemplates).toSorted()).toEqual(
      expectedGeneralTemplates.toSorted(),
    );

    for (const contents of Object.values(allGeneralTemplates)) {
      expect(contents).not.toContain("{{projectName}}");
      expect(contents).not.toContain("{{projectType}}");
    }

    const allInfrastructureTemplates = await getPullRequestTemplatesFromMarkdown({
      category: "infrastructure",
      projectName: "Test project",
      infrastructureProvider: "Terraform",
      requireConfirmationFrom: "Alex",
    });
    const expectedInfrastructureTemplates = [
      "pull_request_template",
      "manual_change",
      "irreversible_destruction",
      "bug_fix",
      "resource_update",
      "new_feature",
      "tooling_change",
      "documentation_change",
      "refactor",
      "miscellaneous",
    ];
    expect(Object.keys(allInfrastructureTemplates).toSorted()).toEqual(
      expectedInfrastructureTemplates.toSorted(),
    );
    for (const contents of Object.values(allInfrastructureTemplates)) {
      expect(contents).not.toContain("{{projectName}}");
      expect(contents).not.toContain("{{requireConfirmationFrom}}");
      expect(contents).not.toContain("{{infrastructureProvider}}");
    }
  });

  test("Throws a DataError if there is no folder corresponding to the category", async () => {
    try {
      // @ts-expect-error: To allow us to simulate a pure JavaScript user
      await getPullRequestTemplatesFromMarkdown({ category: "hi" });
      throw new Error("DID_NOT_THROW");
    } catch (error) {
      if (DataError.check(error)) {
        expect(error.data).toBe("hi");
        expect(error.code).toBe("CATEGORY_NOT_FOUND");
      } else {
        throw error;
      }
    }
  });
});
