# Some Sass for Visual Studio Code

Some Sass is a [language server extension](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide) for Visual Studio Code.
It brings improved code suggestions, documentation and code navigation for both SCSS and indented Sass syntaxes.

Some features include:

- Full support for [`@use`](https://sass-lang.com/documentation/at-rules/use/) and [`@forward`](https://sass-lang.com/documentation/at-rules/forward/), including aliases, prefixes and hiding.
- Workspace-wide code navigation and refactoring, such as Rename Symbol.
- Rich documentation through [SassDoc](http://sassdoc.com).
- Language features for [`%placeholders`](https://sass-lang.com/documentation/style-rules/placeholder-selectors/), both when using them and writing them.
- Support for [both Sass syntaxes](https://sass-lang.com/documentation/syntax/).

![](/docs/src/images/highlight-reel.gif)

## User guide

See the [user guide](https://wkillerud.github.io/some-sass/) to get the most out of Some Sass. There you'll find more about:

- [IntelliSense](https://wkillerud.github.io/some-sass/user-guide/completions.html): Code suggestions that understand the Sass module system, and much more.
- [Navigation](https://wkillerud.github.io/some-sass/user-guide/navigation.html): Go to definition, find all references, and more.
- [Hover info](https://wkillerud.github.io/some-sass/user-guide/hover.html): Surface your SassDoc documentation.
- [Refactoring](https://wkillerud.github.io/some-sass/user-guide/refactoring.html): Rename symbols across your whole workspace.
- [Diagnostics](https://wkillerud.github.io/some-sass/user-guide/diagnostics.html): See deprecated symbols at a glance.
- [Color decorators](https://wkillerud.github.io/some-sass/user-guide/color.html): Get color previews where you use them.

## Recommended settings

These are the recommended settings if you're just getting started.

```jsonc
{
	// Recommended if you don't rely on @import
	"somesass.scss.completion.suggestFromUseOnly": true,
	"somesass.sass.completion.suggestFromUseOnly": true,

	// Optional, if you get suggestions from the current document after namespace.$ (you don't need to type the $ for narrowing down suggestions)
	"editor.wordBasedSuggestions": false,
}
```

### Going all in on Some Sass

If you don't need language features for [Less](https://lesscss.org/) and don't rely on the built-in formatter, we recommend that you:

1. turn off the built-in CSS/SCSS/Less language extension in Visual Studio Code
2. configure Some Sass to turn on all features for CSS, SCSS and Sass indented

See the [Settings reference](https://wkillerud.github.io/some-sass/user-guide/settings.html#going-all-in-on-some-sass) for instructions on how to do this.

If you have SCSS IntelliSense (`mrmlnc.vscode-scss`) installed you should disable or uninstall it.

## Changelog

Visit the [release section on GitHub](https://github.com/wkillerud/some-sass/releases) to see what has changed.

## Acknowledgements

Began as SCSS Intellisense by [Denis Malinochkin and contributors](https://github.com/mrmlnc/vscode-scss). Extends the built-in [VS Code language services](https://github.com/microsoft/vscode-css-languageservice) for SCSS.

The logo is [owned by the Sass](https://sass-lang.com/styleguide/brand) project and licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

Includes documentation from [sass/sass-site](https://github.com/sass/sass-site) (MIT).
