# Development environment

The language server is written in TypeScript and runs both in Node and the browser. While the server can be used outside of Visual Studio Code, it's recommended to use VS Code or VSCodium for development.

You need:

- A current long-term support version of [Node.js](https://nodejs.org/en)
- [Visual Studio Code](https://code.visualstudio.com/) or [VSCodium](https://vscodium.com)

Recommended extensions:

- [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) to help run and debug individual tests.

To preview the documentation you need [mdbook](https://rust-lang.github.io/mdBook/guide/installation.html). If you're on macOS and use [Homebrew](https://brew.sh) you can `brew install mdbook`.

## Getting started

Clone the repo and install dependencies:

```sh
git clone git@github.com:wkillerud/some-sass.git
cd some-sass
npm clean-install
```

Run the build and automated tests. Some of the automated tests open a new window and run in Visual Studio Code Insiders.

```sh
npm run build
npm run test:all
```

### Watch mode

You can have `nx` watch the workspace for changes and rerun a minimum build:

```sh
npm run dev
```

Packages have watch mode for unit tests using Vitest.

```sh
npm test
```

## Run the local build

To run the local build of the extension in VS Code, go to the [Run and Debug pane][vsdebug]. There you will find the different launch configurations.

- Launch extension
- Launch web extension

Running them opens a new window of Visual Studio Code running as a [local extension host][exthost].

Open the Sass project you're using to test in the extension host window.
If you don't have one you can find several `workspace/`
directories inside `vscode-extension/test/e2e/` in this repository.

## Next steps

You may want to have a look at the [architecture](./architecture.md) of the language server. Most of the functionality of the language server is in the `language-services` package in `packages/`.

[Test-driven development](./debugging-unit-tests.md) with Vitest and the VS Code debugger gives the shortest feedback loop.

[vsdebug]: https://code.visualstudio.com/docs/editor/debugging
[exthost]: https://code.visualstudio.com/api/advanced-topics/extension-host
