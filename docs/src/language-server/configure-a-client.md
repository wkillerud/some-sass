# Configure a client

An editor needs a language client for the [Language Server Protocol (LSP)][lsp] to use a language server.

To configure a client for an editor that doesn't have one yet, check the documentation for your editor to see if it supports LSP natively. If not, there may be an extension, add-on or plugin that adds support for LSP.

## Settings

The language server requests [settings](../user-guide/settings.md) via the [`workspace/configuration` message](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_configuration), on the `somesass` key. All fields are optional.

## Existing clients

This list of [language client implementations][languageclients] may be a helpful starting point. You may also want to look at [existing clients](./existing-clients.md).

[lsp]: https://microsoft.github.io/language-server-protocol/
[languageclients]: https://microsoft.github.io/language-server-protocol/implementors/tools/
