## 2.1.0 (2024-12-05)

### 🚀 Features

- add documentSymbols handler ([253aece9](https://github.com/wkillerud/some-sass/commit/253aece9))

### 🩹 Fixes

- **deps:** update dependency fast-glob to v3.3.2 ([4d050e27](https://github.com/wkillerud/some-sass/commit/4d050e27))
- **deps:** update dependencies (non-major) ([3c3bb0c9](https://github.com/wkillerud/some-sass/commit/3c3bb0c9))

### 🧱 Updated Dependencies

- Updated @somesass/language-services to 2.1.0

## 2.0.2 (2024-10-01)


### 🩹 Fixes

- deprecation diagnostics in vue, astro, svelte

## 2.0.1 (2024-09-28)


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 2.0.1

# 2.0.0 (2024-09-28)


### 🚀 Features

- ⚠️  handle all features for css and scss by default


### ⚠️  Breaking Changes

- All language features are now turned on by default for SCSS, Sass indented and CSS.

### 🧱 Updated Dependencies

- Updated @somesass/language-services to 2.0.0

## 1.8.3 (2024-09-19)


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.7.1

## 1.8.2 (2024-09-18)


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.7.0

## 1.8.1 (2024-09-17)


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.6.1

## 1.8.0 (2024-09-12)


### 🚀 Features

- add {module} as a magic string for the afterModule setting


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.6.0

## 1.7.1 (2024-09-11)


### 🩹 Fixes

- apply loadPaths in onDidChangeConfiguration


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.5.1

## 1.7.0 (2024-09-07)


### 🚀 Features

- add two settings to tweak completions in other editors


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.5.0

## 1.6.1 (2024-09-07)


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.4.1

## 1.6.0 (2024-09-05)


### 🚀 Features

- support sass indented syntax


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.4.0

## 1.5.5 (2024-08-24)


### 🩹 Fixes

- race condition in workspace scanner


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.3.4

## 1.5.4 (2024-08-21)


### 🩹 Fixes

- cut release

## 1.5.3 (2024-08-20)


### 🩹 Fixes

- a race condition that caused partials not to be parsed sometimes


### 🔥 Performance

- only run parseStylesheet for new documents


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.3.3

## 1.5.2 (2024-08-20)


### 🩹 Fixes

- apply completion settings


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.3.2

## 1.5.1 (2024-08-11)


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.3.1

## 1.5.0 (2024-08-07)


### 🚀 Features

- feature update for language server


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.3.0

## 1.4.0 (2024-08-04)


### 🚀 Features

- feature update for language server


### 🩹 Fixes

- update dependency vscode-languageserver-textdocument to v1.0.12

- **deps:** update dependency scss-sassdoc-parser to v3.2.0


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.2.0

## 1.3.0 (2024-07-30)


### 🚀 Features

- add support for loadPaths


### 🩹 Fixes

- bugfix update for language server


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.1.0

## 1.2.9 (2024-07-29)


### 🩹 Fixes

- update language server to fix pkg resolution bug

- mark incomplete if empty

- **deps:** update dependency colorjs.io to v0.5.2


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.0.8

## 1.2.8 (2024-07-28)


### 🩹 Fixes

- update language server to fix #182

- update vscode-css-languageservice


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.0.7

## 1.2.7 (2024-07-25)


### 🩹 Fixes

- update language server for completion regression fixes

- don't crash on ENOENT when looking up realPath


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.0.6

## 1.2.6 (2024-06-16)


### 🩹 Fixes

- update language server for completions bugfix


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.0.5

## 1.2.5 (2024-06-15)


### 🩹 Fixes

- read setting for maximum color decorators ([25d276b5](https://github.com/wkillerud/some-sass/commit/25d276b5))


### 🧱 Updated Dependencies

- Updated @somesass/language-services to 1.0.4

## 1.2.4 (2024-05-30)

This was a version bump only for some-sass-language-server to align it with other projects, there were no code changes.

## 1.2.3 (2024-05-01)


### 🩹 Fixes

- remove duplicate suggestions of CSS properties

- update vscode-css-languageservice to 6.2.14