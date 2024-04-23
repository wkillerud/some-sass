# Releasing new versions

This document describes how to release a new version of Some Sass.

## Semantic Release

This repository uses [`semantic-release`][semrel] (technically [`multi-semantic-release`][multisemrel]) to automatically publish changes merged to `main`.

- The [language service package][lsnpm] is published to `npm`.
- The Visual Studio Code extension is published to:
  - [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=SomewhatStationery.some-sass)
  - [Open VSX](https://open-vsx.org/extension/SomewhatStationery/some-sass)

Semantic Release works by [conventional commits][conventional]. Which version is released depends on how you write the commit message.

| Commit message                                                                                                                            | Release type                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs: add guide for configuring sublime`                                                                                                 | No new release.                                                                                                                                                      |
| `fix: update css-languageservice`                                                                                                         | Patch. Bugfix release, updates for runtime dependencies.                                                                                                             |
| `feat: add support for show keyword in forward`                                                                                           | Minor. New feature release.                                                                                                                                          |
| `refactor: remove reduntant options for latest language version`<br><br>`BREAKING CHANGE: The scanImportedFiles option has been removed.` | Major. Breaking release, like removing an option or changing `engines` version. <br /> (Note that the `BREAKING CHANGE: ` token must be in the footer of the commit) |

### Manual fallback

For `npm` packages:

```sh
npm version [major|minor|patch]
npm publish
```

For the VS Code extension:

```sh
vsce package
```

Then publish manually via Visual Studio [Marketplace], [Open VSX] and GitHub Releases (attach the `.vsix` file to the release).

References:

- [npm version](https://docs.npmjs.com/cli/v10/commands/npm-version)
- [npm publish](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [vsce](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [osvx](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)

[semrel]: https://github.com/semantic-release/semantic-release#how-does-it-work
[multisemrel]: https://github.com/qiwi/multi-semantic-release
[conventional]: https://www.conventionalcommits.org/en/v1.0.0/#summary
[Open VSX]: https://open-vsx.org
[Marketplace]: https://marketplace.visualstudio.com/
[lsnpm]: https://www.npmjs.com/package/some-sass-language-server
