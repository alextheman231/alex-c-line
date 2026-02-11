# alex-c-line

![npm version](https://img.shields.io/npm/v/alex-c-line)
![npm downloads](https://img.shields.io/npm/dm/alex-c-line)
![npm license](https://img.shields.io/npm/l/alex-c-line)

[![CI](https://github.com/alextheman231/alex-c-line/actions/workflows/ci.yml/badge.svg)](https://github.com/alextheman231/alex-c-line/actions/workflows/ci.yml)
[![Publish to NPM Registry and GitHub Releases](https://github.com/alextheman231/alex-c-line/actions/workflows/publish.yml/badge.svg)](https://github.com/alextheman231/alex-c-line/actions/workflows/publish.yml)

<img src="./artwork/alex-c-line.png" alt="alex-c-line artwork" width=250 height=250>

This is my command-line tool, which serves as a developer toolkit that can be used in any repository to streamline the developer workflow. It provides a flexible configuration system so you can customise its behaviour to match your workflow.

`alex-c-line` is designed to be developer-first, opinionated where it matters, and safe by default, especially when mutating repository state.

## Installation

To install the command-line tool, you can do this locally per working repository using the following command:

```bash
npm install alex-c-line
```

`npm` may be replaced with your package manager of choice.

Alternatively, you can install it globally for usage all throughout your system, in any working repository. This will allow you to then use `alex-c-line` in repositories that may not even necessarily support it directly, so you can still feel the benefits of some of the more context-agnostic commands.

```bash
npm install -g alex-c-line
```

## Quick start

You can use any command by typing out `alex-c-line` in the terminal, followed by the command you want to run. For example:

```bash
alex-c-line say-hello
```

Some commands may even take extra arguments. For example:

```bash
alex-c-line increment-version v1.2.3 major
```

Flags may also be passed through in the following way.

```bash
alex-c-line increment-version v1.2.3 major --no-prefix
```

Note that for `use-local-package` specifically, you will need to add `--` before the local `alex-c-line` arguments to ensure that all flags get passed through correctly. Example:

```bash
alex-c-line use-local-package alex-c-line -- increment-version v1.2.3 major --no-prefix
```

## Configs

Some commands also support usage of the config system. For example, `pre-commit-2` supports the `alex-c-line.config.js` file, and `use-local-package` supports the more user-specific `.alex-c-line.private.config.js` file. `alex-c-line.config.js` is intended for shared configurations per repository, whereas `.alex-c-line.private.config.js` are for configurations specific to the user's usage.

The `configs` subpath provides some helper functions and types that may be helpful when constructing these configs. Namely, `defineAlexCLineConfig` can be used as a type helper, so that you get better type hints in the editor.

```javascript
import { defineAlexCLineConfig } from "alex-c-line/configs";

export default defineAlexCLineConfig({
  createPullRequestTemplate: {
    category: "general",
    projectType: "package",
  },
  preCommit: {
    packageManager: "pnpm",
    steps: ["build", "format", "lint", "test"],
  },
})
```

Alternatively, you can create a TypeScript file, then build it to a pure JavaScript file, and the benefit of that is that you'd be able to use the types directly instead, which may be better as it even takes a type argument for the pre-commit steps.

```typescript
import type { AlexCLineConfig } from "alex-c-line/configs";

import { scripts } from "./package.json" with { type: "json" };

const alexCLineConfig: AlexCLineConfig<keyof typeof scripts> = {
  createPullRequestTemplate: {
    category: "general",
    projectType: "package",
  },
  preCommit: {
    packageManager: "pnpm",
    steps: ["build", "format", "lint", "test"],
  },
};

export default alexCLineConfig;
```

Note, however, that we do not support directly running config files with TypeScript just yet. This may be planned in the near future, but for now, building the pure TypeScript file to pure JavaScript and using that as the config file is the best bet as of now.

Private configs can be treated in the same way, except the type would be `AlexCLinePrivateConfig`, and the function `defineAlexCLinePrivateConfig`. Please also note that if you create a private config in a shared repository, it MUST be added to `.gitignore` so that it stays user-specific and does not get included in version control.

## Documentation

A full documentation site is coming soon. In the meantime, you may run `alex-c-line --help` for more information about how to use all commands.
