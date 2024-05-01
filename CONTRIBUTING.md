# Contributing

Thank you for showing an interest in contributing, be it to the language server, to the VS Code extension, the documentation, or in some other way 🌟

The best place to get started is [the guide for new contributors](https://wkillerud.github.io/some-sass/contributing/new-contributors.html).

## Conventional commits

This repository uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to automate versioning and changelog generation.

| Commit message                                                                                                                            | Release type                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs: added a guide for configuring sublime text`                                                                                        | Patch. Bugfix release, updates for runtime dependencies.                                                                                                             |
| `fix: update css-languageservice`                                                                                                         | Patch. Bugfix release, updates for runtime dependencies.                                                                                                             |
| `feat: add support for show keyword in forward`                                                                                           | Minor. New feature release.                                                                                                                                          |
| `refactor: remove reduntant options for latest language version`<br><br>`BREAKING CHANGE: The scanImportedFiles option has been removed.` | Major. Breaking release, like removing an option or changing `engines` version. <br /> (Note that the `BREAKING CHANGE: ` token must be in the footer of the commit) |
