# Use Some Sass outside Visual Studio Code

Some Sass is a language server using the [Language Server Protocol (LSP)][lsp].

The language server is [published independently to npm][npm], and can be used with any editor that has an LSP client.

It's recommended you turn off any existing language server that handles SCSS and Sass. You may also use this language server to handle CSS. Its feature set matches that of `vscode-css-language-server`.

## Getting started

You can install the language server with `npm`:

```sh
npm install --global some-sass-language-server
```

Then start the language server like so:

```sh
some-sass-language-server --stdio
```

Tweak the log level by using the `--loglevel` argument, or by using the `somesass.workspace.logLevel` setting. Available loglevels are:

- silent
- fatal
- error
- warn
- info (default)
- debug
- trace

```sh
some-sass-language-server --stdio --loglevel debug
```

## Configure your editor's client

The next step is to [configure your editor's language client](./configure-a-client.md).

[lsp]: https://microsoft.github.io/language-server-protocol/
[npm]: https://www.npmjs.com/package/some-sass-language-server
