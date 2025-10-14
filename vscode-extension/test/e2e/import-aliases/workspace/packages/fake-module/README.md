# @org-scope/fake-module

`package.json` is included only as an example, it's not used by Some Sass to determine the import aliases.

In other words you can have a different `name` field than what you use in `.vscode/settings.json` should you want to (though that would perhaps be a bit odd!).

Same goes for the `exports` field in `package.json`. It does not affect importAliases, though Some Sass _does_ use the `exports` when you use
[`pkg:` importers](https://sass-lang.com/documentation/at-rules/use/#node-js-package-importer). See for example the [pkg-import test case](../../../../defaults-scss/workspace/pkg-import/).
