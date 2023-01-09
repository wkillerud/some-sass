import { deepStrictEqual } from "assert";
import { EOL } from "os";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Position, Range } from "vscode-languageserver-types";
import { ExtractProvider } from "../../../features/code-actions";

describe("Providers/Extract", () => {
	it("supports extracting a variable", async () => {
		const provider = new ExtractProvider({
			tabSize: 2,
			insertSpaces: true,
			indentSize: 2,
		});

		const document = TextDocument.create(
			"unit.scss",
			"scss",
			1,
			`--var: black;${EOL}`,
		);
		const selection = Range.create(
			Position.create(0, 7),
			Position.create(0, 12),
		);

		const [variableAction] = await provider.provideCodeActions(
			document,
			selection,
		);

		deepStrictEqual(variableAction.edit?.documentChanges, [
			{
				edits: [
					{
						newText: `$_variable: black;${EOL}--var: $_variable`,
						range: {
							end: {
								character: 12,
								line: 0,
							},
							start: {
								character: 0,
								line: 0,
							},
						},
					},
				],
				textDocument: {
					uri: "unit.scss",
					version: 1,
				},
			},
		]);
	});

	it("supports extracting a multiline variable", async () => {
		const provider = new ExtractProvider({
			tabSize: 2,
			insertSpaces: false,
			indentSize: 2,
		});

		const document = TextDocument.create(
			"unit.scss",
			"scss",
			1,
			`box-shadow: inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),
	0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);
`,
		);
		const selection = Range.create(
			Position.create(0, 12),
			Position.create(1, 111),
		);

		const [variableAction] = await provider.provideCodeActions(
			document,
			selection,
		);

		deepStrictEqual(variableAction.edit?.documentChanges, [
			{
				edits: [
					{
						newText: `$_variable: inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),
	0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);
box-shadow: $_variable;`,
						range: {
							end: {
								character: 111,
								line: 1,
							},
							start: {
								character: 0,
								line: 0,
							},
						},
					},
				],
				textDocument: {
					uri: "unit.scss",
					version: 1,
				},
			},
		]);
	});

	it("supports extracting a mixin with tab indents", async () => {
		const provider = new ExtractProvider({
			tabSize: 2,
			insertSpaces: false,
			indentSize: 2,
		});

		const document = TextDocument.create(
			"unit.scss",
			"scss",
			1,
			`
a.cta {
	color: var(--cta-text);
	text-decoration: none;

	&:visited {
		color: var(--cta-text);
	}
}
`,
		);
		const selection = Range.create(
			Position.create(2, 1),
			Position.create(7, 2),
		);

		const [, mixinAction] = await provider.provideCodeActions(
			document,
			selection,
		);

		deepStrictEqual(mixinAction.edit?.documentChanges, [
			{
				edits: [
					{
						// prettier-ignore
						newText: `@mixin _mixin {
		color: var(--cta-text);
		text-decoration: none;

		&:visited {
			color: var(--cta-text);
		}
	}
	@include _mixin;`,
						range: {
							end: {
								character: 2,
								line: 7,
							},
							start: {
								character: 1,
								line: 2,
							},
						},
					},
				],
				textDocument: {
					uri: "unit.scss",
					version: 1,
				},
			},
		]);
	});

	it("supports extracting a mixin with space indents", async () => {
		const provider = new ExtractProvider({
			tabSize: 2,
			insertSpaces: true,
			indentSize: 4,
		});

		const document = TextDocument.create(
			"unit.scss",
			"scss",
			1,
			`
a.cta {
    color: var(--cta-text);
    text-decoration: none;

    &:visited {
        color: var(--cta-text);
    }
}
`,
		);
		const selection = Range.create(
			Position.create(2, 4),
			Position.create(7, 5),
		);

		const [, mixinAction] = await provider.provideCodeActions(
			document,
			selection,
		);

		deepStrictEqual(mixinAction.edit?.documentChanges, [
			{
				edits: [
					{
						// prettier-ignore
						newText: `@mixin _mixin {
        color: var(--cta-text);
        text-decoration: none;

        &:visited {
            color: var(--cta-text);
        }
    }
    @include _mixin;`,
						range: {
							end: {
								character: 5,
								line: 7,
							},
							start: {
								character: 4,
								line: 2,
							},
						},
					},
				],
				textDocument: {
					uri: "unit.scss",
					version: 1,
				},
			},
		]);
	});

	it("supports extracting a function with tab indents", async () => {
		const provider = new ExtractProvider({
			tabSize: 2,
			insertSpaces: false,
			indentSize: 2,
		});

		const document = TextDocument.create(
			"unit.scss",
			"scss",
			1,
			`box-shadow: inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),
	0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);
`,
		);
		const selection = Range.create(
			Position.create(0, 12),
			Position.create(1, 111),
		);

		const [, , functionAction] = await provider.provideCodeActions(
			document,
			selection,
		);

		deepStrictEqual(functionAction.edit?.documentChanges, [
			{
				edits: [
					{
						newText: `@function _function() {
	@return inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),
		0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);
}
box-shadow: _function();`,
						range: {
							end: {
								character: 111,
								line: 1,
							},
							start: {
								character: 0,
								line: 0,
							},
						},
					},
				],
				textDocument: {
					uri: "unit.scss",
					version: 1,
				},
			},
		]);
	});

	it("supports extracting a function with space indents", async () => {
		const provider = new ExtractProvider({
			tabSize: 2,
			insertSpaces: true,
			indentSize: 2,
		});

		const document = TextDocument.create(
			"unit.scss",
			"scss",
			1,
			`box-shadow: inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),
  0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);
`,
		);
		const selection = Range.create(
			Position.create(0, 12),
			Position.create(1, 112),
		);

		const [, , functionAction] = await provider.provideCodeActions(
			document,
			selection,
		);

		deepStrictEqual(functionAction.edit?.documentChanges, [
			{
				edits: [
					{
						newText: `@function _function() {
  @return inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),
    0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);
}
box-shadow: _function();`,
						range: {
							end: {
								character: 112,
								line: 1,
							},
							start: {
								character: 0,
								line: 0,
							},
						},
					},
				],
				textDocument: {
					uri: "unit.scss",
					version: 1,
				},
			},
		]);
	});
});
