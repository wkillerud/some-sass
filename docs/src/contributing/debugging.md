# Debugging

This page assumes you're using Visual Studio Code as the debugger. Go to the [Run and Debug pane][vsdebug] in VS Code to find the different launch configurations.

- Launch extension
- Launch web extension
- Launch integration tests
- Launch web integration tests

## Launch extension

This opens a new window of Visual Studio Code running as a [local extension host][exthost]. Open the Sass project you're using to test in the extension host window. If you don't have one you can open the folder `vscode-extension/test/fixtures/` in this repository.

Find `node-server.js` in the `vscode-extension/dist/` folder to set breakpoints.

![](../images/debugging/launch-extension.png)

If you make changes to the code you need to run `npm run build` and restart the debugger.

## Launch web extension

This opens a new window of Visual Studio Code running as a [web extension host][exthost]. Open the Sass project you're using to test in the extension host window. If you don't have one you can open the folder `vscode-extension/test/fixtures/` in this repository.

Find `browser-server.js` in the `vscode-extension/dist/` folder to set breakpoints.

![](../images/debugging/launch-browser-extension.png)

If you make changes to the code you need to run `npm run build` and restart the debugger.

[exthost]: https://code.visualstudio.com/api/advanced-topics/extension-host
[vsdebug]: https://code.visualstudio.com/docs/editor/debugging
