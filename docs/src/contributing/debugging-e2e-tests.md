# Debugging end-to-end tests

End-to-end tests run in Visual Studio Code and are helpful to ensure the user experience is as we expect. However, they can be tricky to write sometimes. This document describes how you can debug the tests themselves.

## Preparing Visual Studio Code

The debugger runs tests in your version of Visual Studio Code, not VS Code insiders like when running the tests from the command line. You need to:

1. Install [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), [Astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) and [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).
2. Use the default settings for Some Sass (use the included workspace settings from the repo).

[exthost]: https://code.visualstudio.com/api/advanced-topics/extension-host

## Writing an integration test

Integration tests run in the context of the language client. This means tests have access to the [Visual Studio Code JavaScript API][jsapi]. Tests use the VS Code JS API to make requests to the language server and check that the response is as expected.

See existing tests in `vscode-extension/test/` for some examples. There is a separate test suite for Web.

## Launch integration tests

Go to the [Run and Debug pane][vsdebug] in VS Code and run Launch integration tests.

[jsapi]: https://code.visualstudio.com/api/references/vscode-api
[vsdebug]: https://code.visualstudio.com/docs/editor/debugging
