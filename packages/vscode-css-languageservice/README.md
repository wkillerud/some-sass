# @somesass/vscode-css-languageservice

This is a private fork of vscode-css-languageservice with additions to support the language features in [language-services](../language-services/).

## Changes from upstream

These changes should be kept whenever we merge in changes from upstream. Cross off what is sent upstream.

- [ ] findDocumentLinks extension with use and forward metadata (for most language features).
  - [ ] `StylesheetDocumentLink` type.
  - [ ] Additions in `_parseUse` in `scssParser.ts` surrouding `this.acceptIdent("as")`.
  - [ ] Push `sass:` links as resolved in `findDocumentLinks` and `findDocumentLinks2` in `cssNavigation.ts` (we use them for completions).
  - [ ] Additions for `as`, `hide`, `show` and `type` in `findUnresolvedLinks` in `cssNavigation.ts`.
  - [x] `pkg:` imports.
- [ ] Placeholder selectors and usages in symbols (for completions, navigation).
  - [ ] `_parseExtends` in `scssParser.ts`.
  - [ ] `collectDocumentSymbols` in `cssNavigation.ts` surrounding `NodeType.SelectorPlaceholder`.
- [ ] Mixin reference node for namespaced mixins in `_parseMixinReference` in `scssParser.ts` (for completions).
- [ ] Details with parameters for functions and mixins for signature helper in `findDocumentSymbols` in `cssNavigation.ts` (for signature helpers).
