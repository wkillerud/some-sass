# Syntaxes

See [Syntax highlighting guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
for some good background information before you dive into the TextMate grammar.

The grammar works on one line at a time.
For an indentation based language like Sass this means we need to use
signals other than newline to figure out "where we are".

You might want the
[documentation for the Regular Expression syntax](https://macromates.com/manual/en/regular_expressions#syntax_oniguruma)
used in the grammars.

`sass.tmLanguage.json` is an adaptation of the [grammar for SCSS](https://github.com/microsoft/vscode/blob/main/extensions/scss/syntaxes/scss.tmLanguage.json).
The SCSS grammar can be a useful reference when working with the Sass grammar.

If a matching pattern isn't behaving the way you expect, test it and the code you expect to match in https://rubular.com.
Remember to remove double slashes. For example:

- This pattern in JSON `(?<=@include)\\s+(?:([\\w-]+)\\s*(\\.))?([\\w-]+)`
- Should be `(?<=@include)\s+(?:([\w-]+)\s*(\.))?([\w-]+)` on Rubular.
