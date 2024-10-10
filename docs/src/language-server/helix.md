# Helix

You can configure new language servers in [`.config/helix/languages.toml`](https://docs.helix-editor.com/guides/adding_languages.html).

[Install the language server if you haven't already](./getting-started.md), then add this config you `languages.toml`.

```toml
[language-server.some-sass-language-server]
command = "some-sass-language-server"
args = ["--stdio"]
# see https://wkillerud.github.io/some-sass/language-server/settings.html for all available settings
config = { somesass = { workspace = { loadPaths = [] } } }

[[language]]
name = "scss"
language-servers = [
	{ name = "some-sass-language-server" }
]
```

The language server will start once you open an SCSS file.

You can also use it for CSS.

```toml
[[language]]
name = "css"
language-servers = [
	{ name = "some-sass-language-server" }
]
```

At time of writing there doesn't seem to be a grammar for Sass indented available in Helix.
