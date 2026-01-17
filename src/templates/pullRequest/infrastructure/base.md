---
id: base
category: infrastructure
placeholders:
- projectName
- infrastructureProvider
---


# Select a Template

Please select the option that best describes your changes to {{projectName}}:

- [Manual Change](?template=manual_change.md) - For changes that require me to manually alter {{infrastructureProvider}} resources in some way.
- [Irreversible Destruction](?template=irreversible_destruction.md) - For changes that irreversibly destroy something managed by {{infrastructureProvider}}.
- [Bug Fix](?template=bug_fix.md) - For changes that fix a failing deployment and/or unwanted side effect of a given deployment.
- [Resource Update](?template=resource_update.md) - For changes that update existing resources already managed by {{infrastructureProvider}}.
- [New Feature](?template=new_feature.md) - For changes that only add to the configuration and do not alter any existing resources.
- [Tooling Change](?template=tooling_change.md) - For changes to this repository's tooling (dependencies, devDependencies, configs...).
- [Documentation Change](?template=documentation_change.md) - For changes that affect the way that information about the code is presented to users.
- [Refactor](?template=refactor.md) - For changes that change code quality and structure without affecting the resulting plan.
- [Miscellaneous](?template=miscellaneous.md) - For changes that do not fit cleanly into any of the above categories.

In some cases, your pull request may be doing more than one of these. In this case, please select a template from the top-down.
For example, if you are introducing a new feature but also making changes to tooling, please select `New Feature` as that comes before tooling in the list.
This ensures that the most impactful aspect of the change is reflected.
