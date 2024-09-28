# Configure a client

An editor needs a language client for the [Language Server Protocol (LSP)][lsp] to use a language server.

Your editor [may have a client already](./existing-clients.md). If not, check the documentation for your editor to see if it supports LSP natively. There may be an extension, add-on or plugin that adds support for LSP if it's not built in.

## Language clients

This list of [language client implementations][languageclients] may be a helpful starting point. You can also look at how [existing clients](./existing-clients.md) are set up.

### Log messages sent by VS Code to the server

If you're having trouble it might be helpful to compare your client with VS Code's. To log the messages sent between VS Code and the language server, add this to [your `settings.json`](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson) (thank you to [Stefan Schlichthärle](https://www.sscit.de/2021/04/15/trace-lsp-in-vscode.html)).

```json
"some-sass.trace.server": "verbose"
```

Now you can open a Sass file, then open the Output panel (View menu -> Output) to see the messages.

## Settings

The language server requests [settings](https://wkillerud.github.io/some-sass/user-guide/settings.html) via the [`workspace/configuration` message](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_configuration), on the `somesass` key. All fields are optional.

You can also configure the language server by sending the [`workspace/didChangeConfiguration` message](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_didChangeConfiguration).

While settings keys are documented with dot-notation, the shape of the settings is a nested object. Your editor may be able to translate from dot-notation to a properly formated object, but not every editor allows this.

For example, while we may document `"somesass.workspace.loadPaths": []` (and write it this way in `settings.json` in VS Code), the actual shape of the settings object sent to the server looks like this.

```json
{
	"settings": {
		"somesass": {
			"workspace": {
				"loadPaths": []
			}
		}
	}
}
```

[lsp]: https://microsoft.github.io/language-server-protocol/
[languageclients]: https://microsoft.github.io/language-server-protocol/implementors/tools/
