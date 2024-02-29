# Some Sass Language Server

This is the SCSS language server that powers the [Some Sass extension for Visual Studio Code](https://github.com/wkillerud/vscode-scss). It provides:

- Full support for `@use` and `@forward`, including aliases, prefixes and hiding.
- Workspace-wide code navigation and refactoring, such as Rename Symbol.
- Rich documentation through [SassDoc](http://sassdoc.com).
- Language features for `%placeholder-selectors`, both when using them and writing them.
- Suggestions and hover info for built-in Sass modules, when used with `@use`.

## Usage

See [Editors with clients](#editors-with-clients). If your editor is not listed, refer to your editor's documentation for integrating with a language server using LSP.

You can install the language server with `npm`:

```sh
npm install --global some-sass-language-server
```

Then start the language server like so:

```sh
some-sass-language-server --stdio
```

## Editors with clients

The language server has clients for

- [Visual Studio Code](https://github.com/wkillerud/vscode-scss)

## Contributing

See [CONTRIBUTING.md](https://github.com/wkillerud/vscode-scss/blob/main/CONTRIBUTING.md).
