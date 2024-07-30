## 1.1.0 (2024-07-30)


### 🚀 Features

- add support for loadPaths


### 🩹 Fixes

- bugfix update for language server


### 🧱 Updated Dependencies

- Updated @somesass/vscode-css-languageservice to 1.1.0

## 1.0.8 (2024-07-29)


### 🩹 Fixes

- update language server to fix pkg resolution bug

- completions after warn, error and debug statements

- mark both variable and function contexts in interpolation

- completions bug where symbols in first document weren't included

- support suggestions in interpolation in class selector

- **deps:** update dependency colorjs.io to v0.5.2


### 🧱 Updated Dependencies

- Updated @somesass/vscode-css-languageservice to 1.0.6

## 1.0.7 (2024-07-28)


### 🩹 Fixes

- update language server to fix #182

- update vscode-css-languageservice


### 🧱 Updated Dependencies

- Updated @somesass/vscode-css-languageservice to 1.0.5

## 1.0.6 (2024-07-25)


### 🩹 Fixes

- update language server for completion regression fixes


### 🧱 Updated Dependencies

- Updated @somesass/vscode-css-languageservice to 1.0.4

## 1.0.5 (2024-06-16)


### 🩹 Fixes

- update language server for completions bugfix

- hide private symbols with - prefix

- only suggest from current namespace

- for wildcard use, omit . for functions in filtertext


### 🧱 Updated Dependencies

- Updated @somesass/vscode-css-languageservice to 1.0.3

## 1.0.4 (2024-06-15)


### 🩹 Fixes

- read setting for maximum color decorators ([25d276b5](https://github.com/wkillerud/some-sass/commit/25d276b5))

- off-by-one for the start of namespace traversal ([#171](https://github.com/wkillerud/some-sass/pull/171))


### 🧱 Updated Dependencies

- Updated @somesass/vscode-css-languageservice to 1.0.2

## 1.0.3 (2024-05-30)


### 🩹 Fixes

- look up the editor limit for color decorators ([#165](https://github.com/wkillerud/some-sass/pull/165))


### 🧱 Updated Dependencies

- Updated some-sass-language-server to 1.2.4

## 1.0.2 (2024-05-01)


### 🩹 Fixes

- update vscode-css-languageservice to 6.2.14