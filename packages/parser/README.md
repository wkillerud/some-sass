# @somesass/parser

This is a grammar for the [lezer](https://lezer.codemirror.net/) parser system.

It's a fork of [`@lezer/sass`](https://github.com/lezer-parser/sass) which does not skip comments, instead parsing them as [SassDoc](https://github.com/SassDoc/sassdoc).

- Parses SCSS [syntax](https://sass-lang.com/documentation/syntax) by default.
- Enable the "indented" dialect to support [indented](https://sass-lang.com/documentation/syntax#the-indented-syntax) syntax.

The code is licensed under an MIT license.

<!-- TODO:
- [ ] Upstream placeholder selectors
- [ ] Upstream maps declarations
-->
