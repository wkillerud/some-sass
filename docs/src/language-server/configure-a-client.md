# Configure a client

An editor needs a language client for the [Language Server Protocol (LSP)][lsp] to use a language server.

To configure a client for an editor that doesn't have one yet, check the documentation for your editor to see if it supports LSP natively. If not, there may be an extension, add-on or plugin that adds support for LSP.

## Settings

The language server requests settings via the [`workspace/configuration` message](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_configuration), on the `somesass` key. All fields are optional.

You can also configure the language server by sending the [`workspace/didChangeConfiguration` message](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_didChangeConfiguration).

While settings keys are documented with dot-notation, the shape of the settings is a nested object.

For example, while we may document `"somesass.loadPaths": []` (and write it this way in `settings.json` in Code), the actual shape of the settings object sent to the server looks like this.

```json
{
	"settings": {
		"somesass": {
			"loadPaths": []
		}
	}
}
```

### Server-only settings

In addition to [the user settings](../user-guide/settings.md), language clients may want to configure these server-only settings to tweak how certain features interact with your specific editor.

| Key                                  | Description                                                                                                                                                                                                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `somesass.completion.afterModule`    | Set this to the empty string if you end up with `module..$variable` after accepting a code suggestion item. If `module.` or `module` disappears, you can set it to `"{module}."` or `"{module}"` respectively. That is a "magic string" that will be replaced with the actual module name. |
| `somesass.completion.beforeVariable` | Set this to the empty string if you end up with `$$variable` after accepting a code suggestion item.                                                                                                                                                                                       |

For example:

```json
{
	"settings": {
		"somesass": {
			"completion": {
				"afterModule": "{module}"
			}
		}
	}
}
```

### Language-specific configuration

For the completion settings above you can tweak them per supported language.

The setting without a specified syntax applies to all of them.
If both are specified, the one for the individual syntax takes precedence.

```json
{
	"settings": {
		"somesass": {
			"completion": {
				"afterModule": "{module}",
			},
			"vue": {
				"completion": {
					"afterModule": "{module}."
				}
			}
		}
	}
}
```

In the example above, `somesass.completion.afterModule` with the value `{module}` applies to all languages except Vue, which uses `{module}.`.



## Existing clients

This list of [language client implementations][languageclients] may be a helpful starting point. You may also want to look at [existing clients](./existing-clients.md).

### Log messages sent by VS Code to the server

If you're having trouble it might be helpful to compare your client with VS Code's. To log the messages sent between VS Code and the language server, add this to [your `settings.json`](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson) (thank you to [Stefan Schlichthärle](https://www.sscit.de/2021/04/15/trace-lsp-in-vscode.html)).

```json
"some-sass.trace.server": "verbose"
```

Now you can open a Sass file, then open the Output panel (View menu -> Output) to see the messages.

[lsp]: https://microsoft.github.io/language-server-protocol/
[languageclients]: https://microsoft.github.io/language-server-protocol/implementors/tools/
