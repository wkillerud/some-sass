# Settings

This document describes the settings available in Some Sass.

## Recommended settings

These are the recommended settings:

```jsonc
{
	// Recommended if you don't rely on @import
	"somesass.scss.completion.suggestFromUseOnly": true,
	"somesass.sass.completion.suggestFromUseOnly": true,

	// Optional, if you get suggestions from the current document after namespace.$ (you don't need the $ for narrowing down suggestions)
	"editor.wordBasedSuggestions": false,
}
```

### About word-based suggestions

When you get completion suggestions and type `namespace.$`, Visual Studio Code treats `$` as a fresh start for suggestions. It will start matching any variable in the current document. There are two ways to get around this:

1. Turn off word-based suggestions by setting `"editor.wordBasedSuggestions": false`.
2. Don't type the `$` when you write the variable name, let completions fill it out for you.

With the second approach you can keep word-based suggestions turned on.

## Settings reference

These are the settings you can use to tune Some Sass.

### Completion

#### Only include suggestions from used modules

If your project is on the modern module syntax (`@use` and `@forward` instead of `@import`), you may want to turn
on this setting.

With this setting turned on, Some Sass will only suggest variables, mixins and functions from the namespaces that are
in use in the open document. This setting will be turned on by default at some point after `@import` becomes CSS-only.

- JSON keys:
  - `somesass.scss.completion.suggestFromUseOnly`
  - `somesass.sass.completion.suggestFromUseOnly`
- Default value: `false`

#### Suggest variables, mixins, and functions from the open document

By default for SCSS in Visual Studio Code, Some Sass will not give code suggestions based on contents
from the current document. This setting is default off in the language server if used outside VS Code.
If you use this server as well as vscode-css-languageserver you can set this setting to false to run
Some Sass in "VS Code Compat Mode".

For SCSS in VS Code, if you prefer the suggestions from Some Sass (for instance if you use SassDoc),
you can opt in by turning on this setting. There will unfortunately be duplicates.

- JSON key: `somesass.scss.completion.suggestAllFromOpenDocument`
- Default value: `false`

#### Suggestion style

Mixins with `@content` SassDoc annotations and `%placeholders` get two suggestions by default:

- One without `{ }`.
- One _with_ `{ }`. This one creates a new block, and moves the cursor inside the block.

If you find this noisy, you can control which suggestions you would like to see:

- All suggestions (default).
- No brackets.
- Only brackets. This still includes other suggestions, where there are no brackets to begin with.

- JSON keys:
  - `somesass.scss.completion.suggestionStyle`
  - `somesass.sass.completion.suggestionStyle`
- Default value: `"all"`

#### Decide when function suggestions should kick in

Suggest functions after the specified symbols when in a string context.
For example, if you add the `/` symbol to this setting, then `background: url(images/he|)`
could suggest a `hello()` function (`|` in this case indicates cursor position).

- JSON keys:
  - `somesass.scss.completion.suggestFunctionsInStringContextAfterSymbols`.
  - `somesass.sass.completion.suggestFunctionsInStringContextAfterSymbols`.
- Default value: `" (+-*%"`

### Workspace

#### Load paths

A list of paths relative to the workspace root where the language server should look for stylesheets loaded by `@use` and `@import`. `node_modules` is always included.

This feature can also be seen referred to as `includePaths`.

Note that you will have to [configure your Sass compiler separately](https://sass-lang.com/documentation/cli/dart-sass/#load-path).

As an example, say you have a stylesheet `shared/my-lib/variables.scss` and would like to import it as `my-lib/variables` in your other stylesheets.

Add this to your settings and restart Visual Studio Code.

```json
{
	"somesass.loadPaths": ["shared/"]
}
```

In a different stylesheet you can then get `shared/my-lib/variables.scss` like this:

```scss
@use "my-lib/variables";
```

- JSON key: `somesass.loadPaths`
- Default value: `[]`

#### Exclude files or folders

List of [micromatch](https://github.com/micromatch/micromatch) patterns for directories that are excluded when scanning.

- JSON key: `somesass.scannerExclude`.
- Default value: `["**/.git/**", "**/node_modules/**", "**/bower_components/**"]`.
