# Kate

The [Kate editor](https://kate-editor.org) has an LSP client where you can
[configure your own servers](https://docs.kde.org/stable5/en/kate/kate/kate-application-plugin-lspclient.html).

This is an example configuration. To apply it:

- Open the Settings dialog
- Go to the LSP Client category
- Pick the User Server Settings tab

```json
{
	"servers": {
		"bash": {
			"command": ["some-sass-language-server", "--stdio", "--debug"],
			"url": "https://github.com/wkillerud/some-sass/packages/language-server",
			"highlightingModeRegex": "^SCSS$"
		}
	}
}
```

Note that this assumes that both `node` and `some-sass-language-server` is available on your `PATH`.

For macOS users: GUI apps don't inherit the same `PATH` as your terminal.
Configuring GUI apps to get the proper `PATH` varies with OS version. A consistent
approach is launching the app from the terminal, for instance for Kate run
`/Applications/kate.app/Contents/MacOS/kate`.
