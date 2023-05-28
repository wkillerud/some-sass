# Some Sass for Visual Studio Code

Some Sass provides code suggestions, documentation and code navigation for SCSS.

- Full support for `@use` and `@forward`, including aliases, prefixes and hiding.
- Workspace-wide code navigation and refactoring, such as Rename Symbol.
- Rich documentation through [SassDoc](http://sassdoc.com).
- Language features for `%placeholder-selectors`, both when using them and writing them.
- Suggestions and hover info for built-in Sass modules, when used with `@use`.

Supports standalone SCSS, as well as style blocks inside Vue, Svelte and Astro components.

## Recommended settings

See [Recommended settings](#recommended-settings-for-visual-studio-code) for some tips on how to tweak code suggestions to your liking.

## Setup

Search for Some Sass (`SomewhatStationery.some-sass`) from the extension installer within VS Code or install from [the Marketplace](https://marketplace.visualstudio.com/items?itemName=SomewhatStationery.some-sass).

Note that if you have SCSS IntelliSense (`mrmlnc.vscode-scss`) installed you should disable or uninstall it. Otherwise the two extensions will both provide hover information and code suggestions.

## Usage

### Code suggestions

Get suggestions for variables, mixins, functions, and SassDoc as you type.

Completions work with and without `@use` namespaces (including from built-in Sass modules). There is also support for `@follow` [prefixes](https://sass-lang.com/documentation/at-rules/forward#adding-a-prefix) and [hiding](https://sass-lang.com/documentation/at-rules/forward#controlling-visibility) (the latter only with `somesass.suggestOnlyFromUse` set to `true`).

If you document your mixin using the `@content` [annotation from SassDoc](http://sassdoc.com/annotations/#content)
the extension will use that information to autosuggest brackets and move focus inside the mixin contents.

<video src="https://user-images.githubusercontent.com/1223410/209579415-759d66b5-c504-49aa-b06a-1dd5091a79b9.mp4" data-canonical-src="https://user-images.githubusercontent.com/1223410/209579415-759d66b5-c504-49aa-b06a-1dd5091a79b9.mp4" controls="controls" muted="muted" class="d-block rounded-bottom-2 border-top width-fit" style="max-height:640px;"></video>

Try documenting your mixins and functions with SassDoc comment blocks.

<video src="https://user-images.githubusercontent.com/1223410/209579456-885e965c-2d1f-490a-9d81-77fb145fcc3c.mp4" data-canonical-src="https://user-images.githubusercontent.com/1223410/209579456-885e965c-2d1f-490a-9d81-77fb145fcc3c.mp4" controls="controls" muted="muted" class="d-block rounded-bottom-2 border-top width-fit" style="max-height:640px;"></video>

If you use `%placeholder-selectors`, you will get suggestions for them both when using them and when writing them. All features work with placeholders, including code navigation, SassDoc on hover, and more.

<video src="https://user-images.githubusercontent.com/1223410/235316476-635b727c-a838-45ff-b282-76f821e8fb1d.mp4" data-canonical-src="https://user-images.githubusercontent.com/1223410/235316476-635b727c-a838-45ff-b282-76f821e8fb1d.mp4" controls="controls" muted="muted" class="d-block rounded-bottom-2 border-top width-fit" style="max-height:640px;"></video>

### Information on hover

Hover over any Sass variables, mixins or functions to see more details about them.

Documentation written with SassDoc will be included in the hover information. Additionally, the extension will provide (~~strikethrough~~) hints when using something marked as `@deprecated` [with SassDoc](http://sassdoc.com/annotations/#deprecated).

<video src="https://user-images.githubusercontent.com/1223410/209579427-12a2dc10-506a-4689-aecf-19645e4dbe49.mp4" data-canonical-src="https://user-images.githubusercontent.com/1223410/209579427-12a2dc10-506a-4689-aecf-19645e4dbe49.mp4" controls="controls" muted="muted" class="d-block rounded-bottom-2 border-top width-fit" style="max-height:640px;"></video>

### Code navigation

#### Go to Definition

To use this feature, either:

- Hold down `Cmd` and click a variable, mixin or function.
- Right-click a variable, mixin or function and choose `Go to Definition`.
- Press `F12` when the cursor is at a variable, mixin or function.

#### Go to Symbol

To use this feature – in the `Go` menu – choose [Go to Symbol](https://code.visualstudio.com/Docs/editor/editingevolved#_go-to-symbol) either for Workspace (`Cmd + T`) or for Editor (`Cmd + Shift + O`).

#### Go to References

Shows an inline view of all references to the variable, mixin or function designed
for quick navigation.

To use this feature, either:

- Right-click a variable, mixin or function and choose `Go to References`.
- Place the cursor on the variable, moxin or function, open the `Go` menu and choose `Go to References`

#### Find All References

Opens a pane in your workbench with a list of all references to the variable,
mixin or function.

To use this feature, right-click a variable, mixin or function and choose
`Find All References`.

### Code actions

#### Rename Symbol

Rename a variable, function or mixin across the entire workspace. Rright click a symbol and choose Rename Symbol, or hit `F2` to start renaming.

If you use prefixes with `@forward` the prefix _will not_ be changed – only the base variable name.

#### Extract

Available when you have an active selection. Pick between extracting to a variable, function or mixin.

See the [Refactoring](https://code.visualstudio.com/docs/editor/refactoring) chapter of the VS Code documentation to see how to use this feature.

## Recommended settings for Visual Studio Code

**Improved code suggestions for variables under namespaces**

When providing code suggestions under namespaces (`@use "namespace"`, then typing `namespace.$`)
you may see the default word-based suggestions appear again. VS Code seems to think of `$` as a
new fresh start for suggestions, so it will start matching any variable in the current document.

You may choose to turn off word based suggestions, but know that you don't actually need
to type the dollar sign for the matches to work. Just type the variable name without `$`
and use the provided suggestion. This way you can keep word based suggestions if you like.

```jsonc
{
	// Recommended if you don't rely on @import
	"somesass.suggestOnlyFromUse": true,

	// Optional, if you get suggestions from the current document after namespace.$ (you don't need the $ for narrowing down suggestions)
	"editor.wordBasedSuggestions": false,

	// Add `scss` to the list of excluded languages for Emmet to avoid suggestions in Vue, Svelte or Astro files.
	// VS Code understands that <style lang="scss">`blocks are SCSS, and so won't show Emmet suggestions in that block.
	"emmet.excludeLanguages": [
		// Markdown is excluded by default in VS Code
		"markdown",
		"scss"
	]
}
```

## Settings for Some Sass

### Code suggestion

#### Only include suggestions from used modules

If your project is on the modern module syntax (`@use` and `@forward` instead of `@import`), you may want to turn
on this setting.

With this setting turned on, Some Sass will only suggest variables, mixins and functions from the namespaces that are
in use in the open document. This setting will be turned on by default at some point after `@import` becomes CSS-only.

- JSON key: `somesass.suggestOnlyFromUse`.
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

### Workspace scanner

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
This will severely limit functionality, and is not recommended. This setting will be removed at some point
after `@import` becomes CSS-only.

- JSON key: `somesass.scanImportedFiles`.
- Default: `true`.

## What this extension does _not_ do

- Formating. Consider using [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) if you want automatic formating.
- Linting. Consider using [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) if you want a linter that supports SCSS.
- Compiling. If you want VS Code to compile SCSS for you, consider [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass).
- Support Sass Indented. See the [Sass](https://marketplace.visualstudio.com/items?itemName=Syler.sass-indented) extension if you use indented syntax.

## Changelog

Visit the [release section on GitHub](https://github.com/wkillerud/vscode-scss/releases) to see what has changed.

## License

Based on SCSS Intellisense by [Denis Malinochkin and contributors](https://github.com/mrmlnc/vscode-scss). Extends the built-in VS Code language server for SCSS.

This software is released under the terms of the MIT license.

The logo is [owned by the Sass](https://sass-lang.com/styleguide/brand) project and licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

Includes documentation from [sass/sass-site](https://github.com/sass/sass-site) (MIT).
