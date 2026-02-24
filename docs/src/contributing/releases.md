# Releasing new versions

This document describes how to release a new version of Some Sass.

A new release typically involves two assets:

- The [language service package][lsnpm] is published to `npm`.
- The Visual Studio Code extension is published to:
  - [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=SomewhatStationery.some-sass)
  - [Open VSX](https://open-vsx.org/extension/SomewhatStationery/some-sass)

## Conventional Commits

We use [nx] to version and tag the language service module based on [conventional commits][conventional].

nx reads the commit messages to determine what the new version should be, and to generate changelogs. Which version is released depends on how you write the commit message.

| Commit message                                                                                                                            | Release type                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs: add guide for configuring sublime`                                                                                                 | No new release.                                                                                                                                                      |
| `fix: update css-languageservice`                                                                                                         | Patch. Bugfix release, updates for runtime dependencies.                                                                                                             |
| `feat: add support for show keyword in fo÷rward`                                                                                           | Minor. New feature release.                                                                                                                                          |
| `refactor: remove reduntant options for latest language version`<br><br>`BREAKING CHANGE: The scanImportedFiles option has been removed.` | Major. Breaking release, like removing an option or changing `engines` version. <br /> (Note that the `BREAKING CHANGE: ` token must be in the footer of the commit) |

## Release process

To start a new release, run `node .scripts/release.mjs`. This script:

1. Gets the latest `main` branch with `git checkout main && git pull`.
2. Runs `npm clean-install`.
3. Runs `npm run release` which updates versions, generates changelogs and Git tags.
4. Pushes the changes and tags with `git push && git push --tags`.

GitHub Actions does the actual publishing when there are new tags.

The script continues to:

1. Update the dependency on the server in `vscode-extension/package.json`.
2. Bump the version number of the extension.
3. Run `npm install` to update the lockfile.
4. Commit the changes and run `git tag some-sass@<version from package.json>`.
5. Run `git push && git push --tags`.

Again, GitHub Actions is does the actual publishing when there are new tags.

### Manual release process

In case `npm run release` fails:

- Update the version numbers in `package.json` across the different packages.
- Make sure you use the new version numbers in `"dependencies"`.
- Run `npm install` to update the lockfile.
- Create a manual changelog entry.
- Commit the changes.
- `git tag` the versions following the existing pattern (`<packagename>@<version>`).
- Push to let GitHub Actions publish with Trusted Publishing.

[nx]: https://nx.dev/recipes/nx-release/automatically-version-with-conventional-commits#usage-with-independent-releases
[conventional]: https://www.conventionalcommits.org/en/v1.0.0/
[Open VSX]: https://open-vsx.org
[Marketplace]: https://marketplace.visualstudio.com/
[lsnpm]: https://www.npmjs.com/package/some-sass-language-server
