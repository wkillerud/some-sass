# Some Sass Language Server

This is the language server that powers the [Some Sass extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=SomewhatStationery.some-sass).

The language server provides:

- Full support for `@use` and `@forward`, including aliases, prefixes and hiding.
- Workspace-wide code navigation and refactoring, such as Rename Symbol.
- Rich documentation through [SassDoc](http://sassdoc.com).
- Language features for `%placeholder-selectors`, both when using them and writing them.
- Suggestions and hover info for built-in Sass modules, when used with `@use`.
- Support for [both Sass syntaxes](https://sass-lang.com/documentation/syntax/) as well as CSS.

## Usage

You can install the language server with `npm`:

```sh
npm install --global some-sass-language-server
```

Then see [how to configure a client](https://wkillerud.github.io/some-sass/language-server/configure-a-client.html).

## Capabilities

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
			<td>✅</td>
		</tr>
		<tr>
			<td>Sass code actions</td>
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
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="4">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_completion">
					<code>textDocument/completion</code>
				</a>
			</th>
			<td>CSS completions</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td>Sass same-document completions</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td>Sass workspace completions</td>
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
			<td>✅</td>
		</tr>
		<tr>
			<td>Sass variable colors</td>
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
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentLink">
					<code>textDocument/documentLink</code>
				</a>
			</th>
			<td>Navigate to linked document</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentSymbol">
					<code>textDocument/documentSymbol</code>
				</a>
			</th>
			<td>Go to symbol in document</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_foldingRange">
					<code>textDocument/foldingRange</code>
				</a>
			</th>
			<td>Code block folding</td>
			<td>✅</td>
			<td>✅</td>
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
			<td>✅</td>
		</tr>
		<tr>
			<td>Sass hover info</td>
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
			<td>✅</td>
		</tr>
		<tr>
			<td>Sass references</td>
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
			<td>✅</td>
		</tr>
		<tr>
			<th rowspan="1">
				<a href="https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_signatureHelp">
					<code>textDocument/signatureHelp</code>
				</a>
			</th>
			<td>Sass function/mixin signature help</td>
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

See the [documentation for an updated list](https://wkillerud.github.io/some-sass/language-server/existing-clients.html).

## Contributing

The best place to get started is [the guide for new contributors](https://wkillerud.github.io/some-sass/contributing/new-contributors.html).
