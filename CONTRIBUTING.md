# Contributing

Thank you for showing an interest in contributing, be it to the language server, to the VS Code extension, the documentation, or in some other way 🌟

The best place to get started if you're new here is to read the guide for new contributors.

### Debugging integration tests for the browser version

Like [debugging integration tests](#debugging-integration-tests), do this when you want to debug the tests themselves rather than functionality. The web integration tests compile to in `web/src/suite/`.

Set breakpoints in the compiled output (`web/dist/suite/index.js`).

At time of writing you may have to set the breakpoints after the debugger has attached. I've had the best success rate clicking repeatedly to set the breakpoint.

## Documentation

There's a documentation website in [`docs/`](./docs).

To preview the documentation on your machine you need [mdbook](https://rust-lang.github.io/mdBook/guide/installation.html). If you're on macOS and use [Homebrew](https://brew.sh) you can `brew install mdbook`.

```sh
cd docs
mdbook serve --open
```

To learn how to work with an mdbook, head over to [the mdbook user guide](https://rust-lang.github.io/mdBook/guide/creating.html).

## Conventional commits

This repository uses [conventional commits and `semantic-release`](https://github.com/semantic-release/semantic-release#how-does-it-work) to automatically publish changes merged to `main`.

Two assets are published:

- The language server is published to npm
- The VS Code extension is published to Visual Studio Marketplace and Open VSX

Keep both in mind when deciding whether a change is a patch, minor or major release.

| Commit message                                                                                                                            | Release type                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs: added a guide for configuring sublime text`                                                                                        | Patch. Bugfix release, updates for runtime dependencies.                                                                                                             |
| `fix: update css-languageservice`                                                                                                         | Patch. Bugfix release, updates for runtime dependencies.                                                                                                             |
| `feat: add support for show keyword in forward`                                                                                           | Minor. New feature release.                                                                                                                                          |
| `refactor: remove reduntant options for latest language version`<br><br>`BREAKING CHANGE: The scanImportedFiles option has been removed.` | Major. Breaking release, like removing an option or changing `engines` version. <br /> (Note that the `BREAKING CHANGE: ` token must be in the footer of the commit) |
