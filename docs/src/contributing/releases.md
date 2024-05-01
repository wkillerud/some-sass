# Releasing new versions

This document describes how to release a new version of Some Sass.

## Conventional Commits

This repository uses [nx] to manage release

- The [language service package][lsnpm] is published to `npm`.
- The Visual Studio Code extension is published to:
  - [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=SomewhatStationery.some-sass)
  - [Open VSX](https://open-vsx.org/extension/SomewhatStationery/some-sass)

nx reads [conventional commits][conventional] to determine what the new versions should be, and to generate changelogs. Which version is released depends on how you write the commit message.

| Commit message                                                                                                                            | Release type                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs: add guide for configuring sublime`                                                                                                 | No new release.                                                                                                                                                      |
| `fix: update css-languageservice`                                                                                                         | Patch. Bugfix release, updates for runtime dependencies.                                                                                                             |
| `feat: add support for show keyword in forward`                                                                                           | Minor. New feature release.                                                                                                                                          |
| `refactor: remove reduntant options for latest language version`<br><br>`BREAKING CHANGE: The scanImportedFiles option has been removed.` | Major. Breaking release, like removing an option or changing `engines` version. <br /> (Note that the `BREAKING CHANGE: ` token must be in the footer of the commit) |

### Release process

To start a new release:

1. Get the latest `main` branch with `git checkout main && git pull`.
2. Run `npx nx release --skip-publish`.
3. Push the changes and tags with `git push && git push --tags`.

GitHub Actions is configured to do the actual publishing when there are new tags.

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

[nx]: https://nx.dev/recipes/nx-release/automatically-version-with-conventional-commits#usage-with-independent-releases
[conventional]: https://www.conventionalcommits.org/en/v1.0.0/
[Open VSX]: https://open-vsx.org
[Marketplace]: https://marketplace.visualstudio.com/
[lsnpm]: https://www.npmjs.com/package/some-sass-language-server
