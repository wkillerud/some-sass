# Settings

This document describes the settings available in Some Sass.

## Recommended settings

These are the recommended settings:

```jsonc
{
	// Recommended if you don't rely on @import
	"somesass.suggestFromUseOnly": true,

	// Optional, if you get suggestions from the current document after namespace.$ (you don't need the $ for narrowing down suggestions)
	"editor.wordBasedSuggestions": false,

	// Optional, for Vue, Svelte, Astro: add `scss` to the list of excluded languages for Emmet to avoid suggestions in Vue, Svelte or Astro files.
	// VS Code understands that <style lang="scss">`blocks are SCSS, and so won't show Emmet suggestions in that block.
	"emmet.excludeLanguages": [
		// Markdown is excluded by default in VS Code
		"markdown",
		"scss",
	],
}
```

### About word-based suggestions

When you get completion suggestions and type `namespace.$`, Visual Studio Code treats `$` as a fresh start for suggestions. It will start matching any variable in the current document. There are two ways to get around this:

1. Turn off word-based suggestions by setting `"editor.wordBasedSuggestions": false`.
2. Don't type the `$` when you write the variable name, let completions fill it out for you.

With the second approach you can keep word-based suggestions turned on.

## Settings reference

These are the settings you can use to tune Some Sass.

### Code suggestion

#### Only include suggestions from used modules

If your project is on the modern module syntax (`@use` and `@forward` instead of `@import`), you may want to turn
on this setting.

With this setting turned on, Some Sass will only suggest variables, mixins and functions from the namespaces that are
in use in the open document. This setting will be turned on by default at some point after `@import` becomes CSS-only.

- JSON key: `somesass.suggestFromUseOnly`.
- Default value: `false`.

#### Suggest variables, mixins, and functions from the open document

Visual Studio Code has built-in suggestions for variables, mixins and functions created in the open document.

By default Some Sass will _not_ send suggestions for the same symbols.
If you prefer the suggestions from Some Sass (for instance if you use SassDoc), you can opt in by turning on this setting.
There will unfortunately be duplicates.

- JSON key: `somesass.suggestAllFromOpenDocument`
- Default value: `false`.

#### Suggestion style

Mixins with `@content` SassDoc annotations and `%placeholders` get two suggestions by default:

- One without `{ }`.
- One _with_ `{ }`. This one creates a new block, and moves the cursor inside the block.

If you find this noisy, you can control which suggestions you would like to see:

- All suggestions (default).
- No brackets.
- Only brackets. This still includes other suggestions, where there are no brackets to begin with.

#### Decide when function suggestions should kick in

Suggest functions after the specified symbols when in a string context.
For example, if you add the `/` symbol to this setting, then `background: url(images/he|)`
could suggest a `hello()` function (`|` in this case indicates cursor position).

- JSON key: `somesass.suggestFunctionsInStringContextAfterSymbols`.
- Default value: `" (+-*%"`.

#### Suggest values for CSS properties

By default, Some Sass triggers property value completion after selecting a CSS property.
Use this setting to disable this behavior.

An example would be accepting a suggestion for `display:` and immediately see suggestions like
`inline-block` for the value.

Note that for SCSS this only applies if `somesass.suggestAllFromOpenDocument` is true,
which is not the case by default in VS Code.
Use `scss.completion.triggerPropertyValueCompletion` to configure the feature built in
to VS Code.

- JSON key: `somesass.triggerPropertyValueCompletion`.
- Default value: `true`.

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

#### Exclude files or folders

List of [micromatch](https://github.com/micromatch/micromatch) patterns for directories that are excluded when scanning.

- JSON key: `somesass.scannerExclude`.
- Default value: `["**/.git/**", "**/node_modules/**", "**/bower_components/**"]`.

#### Adjust scanner depth

Depending on your project size, you may want to tweak this setting to control how many files are included.

- JSON key: `somesass.scannerDepth`.
- Default: `30`.

#### Stop scanner from following links

`@deprecated`

If you don't want Some Sass to follow `@import`, `@use` or `@forward` links you can turn this setting off.
This will limit functionality, and is not recommended. This setting will be removed at some point
after `@import` becomes CSS-only.

- JSON key: `somesass.scanImportedFiles`.
- Default: `true`.
