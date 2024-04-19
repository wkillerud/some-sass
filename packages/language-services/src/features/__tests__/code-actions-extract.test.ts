import { EOL } from "node:os";
import { test, assert, beforeEach } from "vitest";
import {
	CodeAction,
	Position,
	Range,
	TextDocumentEdit,
	TextEdit,
	getLanguageService,
} from "../../language-services";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

beforeEach(() => {
	ls.clearCache();
	ls.configure({}); // Reset any configuration to default
});

const getEdit = (result: CodeAction): TextEdit[] => {
	const edit = result.edit;
	if (!edit) return [];

	const changes = edit.documentChanges;
	if (!changes) return [];

	const change = changes[0] as TextDocumentEdit | undefined;
	if (!change) return [];

	return change.edits;
};

test("extraction for variable", async () => {
	const document = fileSystemProvider.createDocument("--var: black;");

	const result = await ls.getCodeActions(
		document,
		Range.create(Position.create(0, 7), Position.create(0, 12)),
	);

	assert.deepStrictEqual(getEdit(result[0]), [
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
	]);
});

test("extraction for multiline variable", async () => {
	const document = fileSystemProvider.createDocument([
		`box-shadow: inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),`,
		`	0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);`,
	]);

	const result = await ls.getCodeActions(
		document,
		Range.create(Position.create(0, 12), Position.create(1, 111)),
	);

	assert.deepStrictEqual(getEdit(result[0]), [
		{
			newText: `$_variable: inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),${EOL}	0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);${EOL}box-shadow: $_variable;`,
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
	]);
});

test("extraction for mixin with tab indents", async () => {
	ls.configure({
		editorSettings: {
			insertSpaces: false,
		},
	});

	const document = fileSystemProvider.createDocument(`
a.cta {
	color: var(--cta-text);
	text-decoration: none;

	&:visited {
		color: var(--cta-text);
	}
}`);

	const result = await ls.getCodeActions(
		document,
		Range.create(Position.create(2, 1), Position.create(7, 2)),
	);

	assert.deepStrictEqual(getEdit(result[1]), [
		{
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
	]);
});

test("extraction for mixin with space indents", async () => {
	ls.configure({
		editorSettings: {
			insertSpaces: true,
			indentSize: 4,
		},
	});

	const document = fileSystemProvider.createDocument(`
a.cta {
    color: var(--cta-text);
    text-decoration: none;

    &:visited {
        color: var(--cta-text);
    }
}`);

	const result = await ls.getCodeActions(
		document,
		Range.create(Position.create(2, 4), Position.create(7, 5)),
	);

	assert.deepStrictEqual(getEdit(result[1]), [
		{
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
	]);
});

test("extraction for function with tab indents", async () => {
	ls.configure({
		editorSettings: {
			insertSpaces: false,
		},
	});

	const document = fileSystemProvider.createDocument(`
box-shadow: inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),
	0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);
`);

	const result = await ls.getCodeActions(
		document,
		Range.create(Position.create(1, 12), Position.create(2, 111)),
	);

	assert.deepStrictEqual(getEdit(result[2]), [
		{
			newText: `@function _function() {
	@return inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),
		0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);
}
box-shadow: _function();`,
			range: {
				end: {
					character: 111,
					line: 2,
				},
				start: {
					character: 0,
					line: 1,
				},
			},
		},
	]);
});

test("extraction for function with space indents", async () => {
	ls.configure({
		editorSettings: {
			insertSpaces: true,
			indentSize: 2,
		},
	});

	const document = fileSystemProvider.createDocument(`
box-shadow: inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),
  0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);
`);

	const result = await ls.getCodeActions(
		document,
		Range.create(Position.create(1, 12), Position.create(2, 112)),
	);

	assert.deepStrictEqual(getEdit(result[2]), [
		{
			newText: `@function _function() {
  @return inset 0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color),
    0 0 0 jkl.rem(1px) var(--jkl-calendar-border-color), jkl.rem(2px) jkl.rem(4px) jkl.rem(16px) rgb(0 0 0 / 24%);
}
box-shadow: _function();`,
			range: {
				end: {
					character: 112,
					line: 2,
				},
				start: {
					character: 0,
					line: 1,
				},
			},
		},
	]);
});
