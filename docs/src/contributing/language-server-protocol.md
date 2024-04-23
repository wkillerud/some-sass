# Language Server Protocol

From [Why Language Server?][why-lsp]:

> [The] Language Server Protocol [...] standardizes the communication between language tooling and code editor. This way [...] any LSP-compliant language toolings can integrate with multiple LSP-compliant code editors, and any LSP-compliant code editors can easily pick up multiple LSP-compliant language toolings. LSP is a win for both language tooling providers and code editor vendors!

In other words, LSP lets you build the language support tools once and run in any editor that has an LSP client.

For the most part you don't need to worry about the implementation details of the LSP. Microsoft's [TypeScript implementation][implementation] handles the nitty-gritty.

## Language features

The Visual Studio Code documentation for [Programatic language features][features] gives a good sense of what's possible with LSP. If you want to dive deep, the [specification] lists all the messages and their parameters.

[why-lsp]: https://code.visualstudio.com/api/language-extensions/language-server-extension-guide#why-language-server
[features]: https://code.visualstudio.com/api/language-extensions/programmatic-language-features
[implementation]: https://github.com/microsoft/vscode-languageserver-node/tree/main
[specification]: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/
