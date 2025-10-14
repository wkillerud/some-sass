# Import aliases

In this workspace `apps/frontpage/` is set up to be a consumer of a "fake" module in `packages/fake-module/`.

Fake in the sense that `apps/frontpage/` is not able to resolve `@org-scope/fake-module` as a dependency the usual way:

- Regular Node modules resolution.
- [`pkg:` importers](https://sass-lang.com/documentation/at-rules/use/#node-js-package-importer). See for example the [pkg-import test case](../../defaults-scss/workspace/pkg-import/).

If you don't organize your repository so that `@org-scope/fake-module` is an actual dependency in `node_modules`, but rely on some separate build tool, you can use the setting `somesass.workspace.importAliases` as an escape hatch.

See `.vscode/settings.json` and compare it with the folder structure in `packages/`.
