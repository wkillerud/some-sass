# Use Some Sass outside Visual Studio Code

Some Sass is a language server using the [Language Server Protocol (LSP)][lsp].

The language server is [published independently to npm][npm], and can be used with any editor that has an LSP client. The server is designed to run alongside the [VS Code CSS language server](https://github.com/hrsh7th/vscode-langservers-extracted).

## Getting started

You can install the language server with `npm`:

```sh
npm install --global some-sass-language-server
```

Then start the language server like so:

```sh
some-sass-language-server --stdio
```

**Options**

`--debug` – runs the development build of the language server, helpful to get more context if the server crashes

### Settings

The language server requests [settings](../user-guide/settings.md) via `workspace/configuration` on the `somesass` key. All fields are optional.

## Configure a client

The next step is to [configure a language client](./configure-a-client.md).

[lsp]: https://microsoft.github.io/language-server-protocol/
[npm]: https://www.npmjs.com/package/some-sass-language-server
