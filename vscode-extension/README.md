# Some Sass for Visual Studio Code

Some Sass is a [language server extension](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide) for Visual Studio Code. It brings improved code suggestions, documentation and code navigation for SCSS.

Some features include:

- Full support for [`@use`](https://sass-lang.com/documentation/at-rules/use/) and [`@forward`](https://sass-lang.com/documentation/at-rules/forward/), including aliases, prefixes and hiding.
- Workspace-wide code navigation and refactoring, such as Rename Symbol.
- Rich documentation through [SassDoc](http://sassdoc.com).
- Language features for [`%placeholders`](https://sass-lang.com/documentation/style-rules/placeholder-selectors/), both when using them and writing them.

Supports standalone SCSS, as well as style blocks inside Vue, Svelte and Astro components.

![](../docs/src/images/highlight-reel.gif)

Note that if you have SCSS IntelliSense (`mrmlnc.vscode-scss`) installed you should disable or uninstall it. Otherwise the two extensions will both provide hover information and code suggestions.

## User guide

See the [user guide](https://wkillerud.github.io/some-sass/) to get the most out of Some Sass.

## Recommended settings

These are the recommended settings:

```jsonc
{
	// Recommended if you don't rely on @import
	"somesass.suggestOnlyFromUse": true,

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

### Settings reference

See the [settings reference](https://wkillerud.github.io/some-sass/user-guide/settings.html#settings-reference) for more information about the different settings of Some Sass.

## Changelog

Visit the [release section on GitHub](https://github.com/wkillerud/some-sass/releases) to see what has changed.

## License

Based on SCSS Intellisense by [Denis Malinochkin and contributors](https://github.com/mrmlnc/vscode-scss). Extends the built-in VS Code language server for SCSS.

This software is released under the terms of the MIT license.

The logo is [owned by the Sass](https://sass-lang.com/styleguide/brand) project and licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

Includes documentation from [sass/sass-site](https://github.com/sass/sass-site) (MIT).
