# Building

This document describes how to build Some Sass.

## The workspace

This repo is an `npm` [workspace] with several packages listed in the `"workspaces"` key in the root `package.json`. The packages are listed in order with the "base" package at the top and the published language server and extension toward the bottom.

## A full build

Run this command at the root level of the repo to build all packages:

```sh
npm run build
```

This will build all packages and the Visual Studio Code extension.

### Partial builds

Each package has its own `build` command. If you made a change in the `language-server` folder you only have to build that and the `vscode-extension` packages. Of course you can allways do a full build if you want.

## Clean builds

If something unexpected happens with your build you can do a clean build:

```sh
npm run clean
npm run clean-install
npm run build
```

This deletes any old build you may have before doing a new build.

[workspace]: https://docs.npmjs.com/cli/v10/using-npm/workspaces
