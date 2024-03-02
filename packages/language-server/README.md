# Some Sass Language Server

This is the SCSS language server that powers the [Some Sass extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=SomewhatStationery.some-sass), available as an independent and reusable language server.

The language server provides:

- Full support for `@use` and `@forward`, including aliases, prefixes and hiding.
- Workspace-wide code navigation and refactoring, such as Rename Symbol.
- Rich documentation through [SassDoc](http://sassdoc.com).
- Language features for `%placeholder-selectors`, both when using them and writing them.
- Suggestions and hover info for built-in Sass modules, when used with `@use`.

This language server is designed to run alongside the [VS Code CSS language server](https://github.com/hrsh7th/vscode-langservers-extracted).

## Usage

See [Editors with clients](https://github.com/wkillerud/some-sass/blob/main/README.md#editors-with-clients). If your editor is not listed, refer to your editor's documentation for integrating with a language server using LSP.

You can install the language server with `npm`:

```sh
npm install --global some-sass-language-server
```

Then start the language server like so:

```sh
some-sass-language-server --stdio
```

Required initialization options:

- `workspace` – typically the root directory of your project

Optional initialization parameters:

- `settings` – see [workspace configuration](#workspace-configuration)

### Workspace configuration

The language server requests configuration via `workspace/configuration` on the `somesass` key. All fields are optional.

- `suggestAllFromOpenDocument` – VS Code has built-in code suggestions for symbols declared in the open document, so the default behavior for this server is to not include them. For other editors, you may want to turn this on (default: `false`).
- `suggestFromUseOnly` – If your project uses the new module system with @use and @forward, you may want to only include suggestions from your used modules (default: `false`).
- `suggestionStyle` - controls the style of suggestions for mixins and placeholders, either `nobracket`, `bracket` or `all` (includes both, if applicable) (default: `all`).
- `scannerExclude` – array of minimatch/glob patterns that the scanner ignores (default: `["**/.git/**", "**/node_modules/**", "**/bower_components/**"]`).
- `scannerDepth` – limit the directory depth of the initial scan for `.scss` files (default: 30).
- `suggestFunctionsInStringContextAfterSymbols` – customize when to suggest functions inside strings (default: ` (+-*%`).

The options can also be passed as initialization options, on the `settings` key.

## Editors with clients

See [this list](https://github.com/wkillerud/some-sass/blob/main/README.md#editors-with-clients).

## Contributing

See [CONTRIBUTING.md](https://github.com/wkillerud/some-sass/blob/main/CONTRIBUTING.md).
