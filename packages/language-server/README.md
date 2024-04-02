# Some Sass Language Server

This is the SCSS language server that powers the [Some Sass extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=SomewhatStationery.some-sass), available as an independent and reusable language server.

The language server provides:

- Full support for `@use` and `@forward`, including aliases, prefixes and hiding.
- Workspace-wide code navigation and refactoring, such as Rename Symbol.
- Rich documentation through [SassDoc](http://sassdoc.com).
- Language features for `%placeholder-selectors`, both when using them and writing them.
- Suggestions and hover info for built-in Sass modules, when used with `@use`.

This language server is designed to run alongside the [VS Code CSS language server](https://github.com/hrsh7th/vscode-langservers-extracted).

## Usage

See [Editors with clients](https://github.com/wkillerud/some-sass/blob/main/README.md#editors-with-clients). If your editor is not listed, refer to your editor's documentation for integrating with a language server using LSP.

You can install the language server with `npm`:

```sh
npm install --global some-sass-language-server
```

Then start the language server like so:

```sh
some-sass-language-server --stdio
```

### Workspace configuration

The language server requests configuration via `workspace/configuration` on the `somesass` key. All fields are optional.

- `suggestAllFromOpenDocument` – VS Code has built-in code suggestions for symbols declared in the open document, so the default behavior for this server is to not include them. For other editors, you may want to turn this on (default: `false`).
- `suggestFromUseOnly` – If your project uses the new module system with @use and @forward, you may want to only include suggestions from your used modules (default: `false`).
- `suggestionStyle` - controls the style of suggestions for mixins and placeholders, either `nobracket`, `bracket` or `all` (includes both, if applicable) (default: `all`).
- `scannerExclude` – array of minimatch/glob patterns that the scanner ignores (default: `["**/.git/**", "**/node_modules/**", "**/bower_components/**"]`).
- `scannerDepth` – limit the directory depth of the initial scan for `.scss` files (default: 30).
- `suggestFunctionsInStringContextAfterSymbols` – customize when to suggest functions inside strings (default: ` (+-*%`).

The options can also be passed as initialization options, on the `settings` key.

## Capabilities

This language server is designed to run alongside the [VS Code CSS language server](https://github.com/hrsh7th/vscode-langservers-extracted).

<table>
	<caption style="visibility:hidden">Comparison of <code>vscode-css-languageservice</code> and <code>some-sass-language-service</code></caption>
	<thead>
		<tr>
			<th>Request</th>
			<th>Capability</th>
			<th>vscode-css</th>
			<th>some-sass</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th rowspan="2">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_codeAction">
					<code>textDocument/codeAction</code>
				</a>
			</th>
			<td>CSS code actions</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<td>SCSS code actions</td>
			<td></td>
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_colorPresentation">
					<code>textDocument/colorPresentation</code>
				</a>
			</th>
			<td>Color picker for CSS colors</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<th rowspan="4">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_completion">
					<code>textDocument/completion</code>
				</a>
			</th>
			<td>CSS completions</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<td>SCSS same-document completions</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td>SCSS workspace completions</td>
			<td></td>
			<td>✅</td>
		</tr>
		<tr>
			<td>SassDoc completions</td>
			<td></td>
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="2">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_definition">
					<code>textDocument/definition</code>
				</a>
			</th>
			<td>Same-document definition</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td>Workspace definition</td>
			<td></td>
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="2">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentColor">
					<code>textDocument/documentColor</code>
				</a>
			</th>
			<td>CSS colors</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<td>SCSS variable colors</td>
			<td></td>
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentHighlight">
					<code>textDocument/documentHighlight</code>
				</a>
			</th>
			<td>Highlight references in document</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentLink">
					<code>textDocument/documentLink</code>
				</a>
			</th>
			<td>Navigate to linked document</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentSymbol">
					<code>textDocument/documentSymbol</code>
				</a>
			</th>
			<td>Go to symbol in document</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_foldingRange">
					<code>textDocument/foldingRange</code>
				</a>
			</th>
			<td>Code block folding</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_formatting">
					<code>textDocument/formatting</code>
				</a>
			</th>
			<td>Format document</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<th rowspan="3">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_hover">
					<code>textDocument/hover</code>
				</a>
			</th>
			<td>CSS hover info</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<td>SCSS hover info</td>
			<td></td>
			<td>✅</td>
		</tr>
		<tr>
			<td>SassDoc hover info</td>
			<td></td>
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_rangeFormatting">
					<code>textDocument/rangeFormatting</code>
				</a>
			</th>
			<td>Format selection</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<th rowspan="2">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_references">
					<code>textDocument/references</code>
				</a>
			</th>
			<td>CSS references</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<td>SCSS references</td>
			<td></td>
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="2">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_rename">
					<code>textDocument/rename</code>
				</a>
			</th>
			<td>Same-document rename</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td>Workspace rename</td>
			<td></td>
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_selectionRange">
					<code>textDocument/selectionRange</code>
				</a>
			</th>
			<td>Ranges for expand/shrink selection</td>
			<td>✅</td>
			<td></td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_signatureHelp">
					<code>textDocument/signatureHelp</code>
				</a>
			</th>
			<td>SCSS function/mixin signature help</td>
			<td></td>
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_symbol">
					<code>workspace/symbol</code>
				</a>
			</th>
			<td>Go to symbol in workspace</td>
			<td></td>
			<td>✅</td>
		</tr>
	</tbody>
</table>

## Editors with clients

See [this list](https://github.com/wkillerud/some-sass/blob/main/README.md#editors-with-clients).

## Contributing

See [CONTRIBUTING.md](https://github.com/wkillerud/some-sass/blob/main/CONTRIBUTING.md).
