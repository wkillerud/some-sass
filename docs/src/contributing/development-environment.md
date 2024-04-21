# Development environment

The language server is written in TypeScript and runs both in Node and the browser. While the server can be used outside of Visual Studio Code, it's recommended to use VS Code for development.

You need:

- A long-term support version of [Node.js](https://nodejs.org/en)
- [Visual Studio Code](https://code.visualstudio.com/)

Recommended extensions:

- [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) to help run and debug individual tests.

To preview the documentation you need [mdbook](https://rust-lang.github.io/mdBook/guide/installation.html). If you're on macOS and use [Homebrew](https://brew.sh) you can `brew install mdbook`.

## Getting started

Clone the repo and install dependencies:

```
git clone git@github.com:wkillerud/some-sass.git
cd some-sass
npm install
```

Run the build and automated tests. Some of the automated tests open a new window and run in Visual Studio Code Insiders.

```
npm run build
npm run test:all
```

## Next steps

You may want to have a look at the [architecture](./architecture.md) of the language server. Most of the functionality of the language server is in the `language-services` package in `packages/`.
