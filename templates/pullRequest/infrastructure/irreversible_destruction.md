---
id: irreversible_destruction
category: infrastructure
placeholders:
- projectName
- infrastructureProvider
---

# Irreversible Destruction

This is a change to `{{projectName}}` that irreversibly destroys a managed {{infrastructureProvider}} resource. This change can **NOT** be fixed by simply reverting back the changes as it will try recreating the resource entirely and there is no guarantee that it will be restored back to the same state it was previously in.

Please take extra care before merging this one in, and be absolutely sure that you intend to fully remove the resource associated with this pull request.

Please see the commits tab of this pull request for the description of changes.
