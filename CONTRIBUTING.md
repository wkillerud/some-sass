# Contributing

Thank you for showing an interest in contributing!

Before you start, please make a new Issue. I don't always make new issues for all the things I currently work on. By making a new Issue we can hopefully avoid duplicating our efforts.

If you open a pull request, please **make sure to set the correct target**. This is a fork, and GitHub defaults to using the source repository as a target for pull requests. Please don't create needless noise in the upstream repository. The correct target is `wkillerud/vscode-scss` and the branch `main`.

## Development environment

You will need these things installed:

- Node.js
- Visual Studio Code stable

To get started:

- Fork this repo
- Clone your fork
- Open your cloned repo in Visual Studio Code
- Run `npm install`
- Confirm existing tests are running
  - Run `npm test`
  - Then run `npm run test:e2e`. This downloads VS Code Insiders and runs integration tests.
- Finally, run `npm run dev`, or the Run Build Task command in Visual Studio Code

Changes should now build automatically.

To test your changes:

- Go to the Run and Debug section
- Run the Launch Client configuration

A new window should open with the title `[Extension Development Host]`. In this window you can open whatever project you want to use for testing. If you don't have one you can open the folder `fixtures/e2e/` in this repo.

Every time you make a change you should restart the Launch Client task.

Test your changes and see if they work. If they don't, it's time to do some debugging.

## Debugging the Node (or regular) version

Changes often don't work on the first try. To get a better idea of what's happening, let's debug the _server_ portion of the extension.

In this extension there is a client part and a server part, and most of the work happens in the server part.

In the Run and Debug section you should find an Attach to Server configuration. Run that. You should end up with a badge showing the number 2 on the Run and Debug section.

Now you can set breakpoints to inspect what is really happening in your code. Unfortunately, at time of writing you must set these breakpoints in the _compiled output_ in `dist/node-server.js`.

Open `dist/node-server.js`, search for a function name close to where you want to debug, and place breakpoints where you would like. Then test your changes in the Extension Development Host again. Hopefully you should see the code pause on your breakpoint. If not, confirm the Attach to Server task is running, or try to place breakpoints elsewhere. Something unexpected may stop you from reaching your code.

### Debugging the web version

You may have noticed there are two versions of the extension in the `dist/` folder.

- Node
- Browser

The browser files do just that – run in the browser as a [web extension](https://code.visualstudio.com/api/extension-guides/web-extensions). It works more or less the same as the regular Node version, except it doesn't have direct access to the file system.

To debug the web version, pick the Run Web Extension in VS Code in the Run and Debug section. For the web version you can set breakpoints right in the TypeScript, at least for the client part.

TODO: debug the server once you get it up and running, write down some notes.

### Debugging unit tests

Unit tests can be useful tools to debug more efficiently. If you want to debug using a unit test, the same rule applies – you have to set breakpoints on the compiled output.

Tests are compiled to `out/test/`. Find your test, or the code you want to debug in the `out/` folder, and set breakpoints.

The extension Mocha Test Explorer (`hbenl.vscode-mocha-test-adapter`) is useful to launch individual tests in debug mode. Install the extension, open your unit test, and press the Debug button that should appear over your test. Hopefully you should see the code pause on your breakpoint. If not, try to place breakpoints elsewhere. Something unexpected may stop you from reaching your code.

### Debugging integration tests

Integration tests run in the Extension Development Host, and are more realistic than unit tests. However, sometimes they can be tricky to write. You can debug the tests temselves if you'd like.

This method of debugging is **not recommended** if you want to debug the functionality itself. Instead, debug using the Client + Server configuration explained above, and perform the test manually.

If you still want to debug the integration tests there are a few things to keep in mind, since tests run in this way use your main stable install of VS Code (not Insiders, like from the terminal):

- You will need to install Vetur (`octref.vetur`), Astro (`astro-build.astro-vscode`) and Svelte for VS Code (`svelte.svelte-vscode`).
- You **must** use default settings for Some Sass. Tip: use the included Workspace Settings.
- To compile changes in test code, run `npm run test:compile`

Again, breakpoints must be set in the compiled output. Integration tests are compiled to `out/test/e2e/suite/`. Breakpoints can _only be set in test code_, meaning any code in the `out/test/e2e/` folder.

Now you are ready to start debugging!

Breakpoints set, go to the Run and Debug and run the Integration Tests configuration. Hopefully you should see the code pause on your breakpoint. If not, try to place breakpoints elsewhere. Something unexpected may stop you from reaching your code.
