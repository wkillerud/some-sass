## 2.2.1 (2025-09-06)

### 🩹 Fixes

- completions for values forwarded with prefix and show ([#337](https://github.com/wkillerud/some-sass/pull/337))

## 2.2.0 (2025-07-06)

### 🚀 Features

- add support for oklab and oklch color functions ([#327](https://github.com/wkillerud/some-sass/pull/327))

## 2.1.1 (2025-06-07)

### 🩹 Fixes

- handle newlines after charset in indented syntax ([#318](https://github.com/wkillerud/some-sass/pull/318))
- **deps:** update dependency es-toolkit to v1.38.0  [skip ci] ([#313](https://github.com/wkillerud/some-sass/pull/313))
- **deps:** update dependency tinyglobby to v0.2.14 ([#310](https://github.com/wkillerud/some-sass/pull/310))

## 2.1.0 (2025-05-04)

### 🚀 Features

- support `@scope` ([#308](https://github.com/wkillerud/some-sass/pull/308))

## 2.0.2 (2025-04-06)

### 🩹 Fixes

- upgrade vscode-css-languageservices ([5e246830](https://github.com/wkillerud/some-sass/commit/5e246830))
- update vscode/web-custom-data ([ea3c0b61](https://github.com/wkillerud/some-sass/commit/ea3c0b61))
- **deps:** update dependency fast-glob to v3.3.3 ([#282](https://github.com/wkillerud/some-sass/pull/282))

## 2.0.1 (2024-12-08)

### 🩹 Fixes

- respect `somesass.*.diagnostics.lint.enabled` ([9bb800bc](https://github.com/wkillerud/some-sass/commit/9bb800bc))
- **deps:** update dependency fast-glob to v3.3.2 ([4d050e27](https://github.com/wkillerud/some-sass/commit/4d050e27))
- **deps:** update dependencies (non-major) ([3c3bb0c9](https://github.com/wkillerud/some-sass/commit/3c3bb0c9))

# 2.0.0 (2024-09-28)


### 🚀 Features

- ⚠️  handle all features for css and scss by default


### ⚠️  Breaking Changes

- All language features are now turned on by default for SCSS, Sass indented and CSS.

## 1.7.0 (2024-09-18)


### 🚀 Features

- add completions and documentation for color changes in Sass 1.79.0

## 1.6.0 (2024-09-12)


### 🚀 Features

- add {module} as a magic string for the afterModule setting

## 1.5.1 (2024-09-11)


### 🩹 Fixes

- apply loadPaths in onDidChangeConfiguration

## 1.5.0 (2024-09-07)


### 🚀 Features

- add two settings to tweak completions in other editors

## 1.4.0 (2024-09-05)


### 🚀 Features

- support sass indented syntax

## 1.3.1 (2024-08-24)


### 🩹 Fixes

- exclude sass globals if suggestFromUseOnly

## 1.3.0 (2024-08-07)


### 🚀 Features

- feature update for language server

## 1.2.0 (2024-08-04)


### 🚀 Features

- feature update for language server


### 🩹 Fixes

- update dependency vscode-languageserver-textdocument to v1.0.12

- **deps:** update dependency scss-sassdoc-parser to v3.2.0

## 1.1.0 (2024-07-30)


### 🚀 Features

- add support for loadPaths


### 🩹 Fixes

- bugfix update for language server

## 1.0.6 (2024-07-29)


### 🩹 Fixes

- update language server to fix pkg resolution bug

- **deps:** update dependency colorjs.io to v0.5.2

## 1.0.5 (2024-07-28)


### 🩹 Fixes

- update language server to fix #182

- update vscode-css-languageservice

- support declaring exports without path

## 1.0.4 (2024-07-25)


### 🩹 Fixes

- update language server for completion regression fixes

## 1.0.3 (2024-06-16)


### 🩹 Fixes

- update language server for completions bugfix

## 1.0.2 (2024-06-15)


### 🩹 Fixes

- read setting for maximum color decorators ([25d276b5](https://github.com/wkillerud/some-sass/commit/25d276b5))

## 1.0.1 (2024-05-01)


### 🩹 Fixes

- update vscode-css-languageservice to 6.2.14