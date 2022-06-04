import { tokenizer } from 'scss-symbols-parser';
import { CompletionItemKind, CompletionList, InsertTextFormat } from 'vscode-languageserver-types';

import { sassDocAnnotations } from '../../sassdocAnnotations';
import { getLinesFromText } from '../../utils/document';

import type { CompletionContext } from './completion-context';

export function doSassDocCompletion(text: string, offset: number, context: CompletionContext): CompletionList {
  if (!context.word) {
    const textAfterCursor = text.substring(offset);
    const isCursorAboveFunction = textAfterCursor.match(/^(?:\r\n|\r|\n)\s*@function/);
    const isCursorAboveMixin = textAfterCursor.match(/^(?:\r\n|\r|\n)\s*@mixin/);

    if (isCursorAboveFunction || isCursorAboveMixin) {
      const textBeforeCursor = text.substring(0, offset);
      const linesBeforeCursor = getLinesFromText(textBeforeCursor);

      let isCursorBelowSassDocLine = linesBeforeCursor[linesBeforeCursor.length - 2]?.startsWith("///");
      if (!isCursorBelowSassDocLine) {
        return doSassDocParameterCompletion(textAfterCursor, isCursorAboveFunction ? 'function' : 'mixin');
      }
    }
  }

  return doSassDocAnnotationCompletion(context);
}

function doSassDocAnnotationCompletion({ textBeforeWord }: CompletionContext): CompletionList {
	const completions = CompletionList.create([], true);

	if (textBeforeWord.includes("@example ")) {
		completions.items.push({
			label: 'scss',
			sortText: '-',
			kind: CompletionItemKind.Value,
		});
		completions.items.push({
			label: 'css',
			kind: CompletionItemKind.Value,
		});
		completions.items.push({
			label: 'markup',
			kind: CompletionItemKind.Value,
		});
		completions.items.push({
			label: 'javascript',
			sortText: 'y',
			kind: CompletionItemKind.Value,
		});
		return completions;
	}

	for (const { annotation, aliases, insertText, insertTextFormat } of sassDocAnnotations) {
		const item = {
			label: annotation,
			kind: CompletionItemKind.Keyword,
			insertText,
			insertTextFormat,
			sortText: '-', // Push ourselves to the head of the list
		};

		completions.items.push(item);

		if (aliases) {
			for (const alias of aliases) {
				completions.items.push({
					...item,
					label: alias,
					insertText: insertText ? insertText.replace(annotation, alias) : insertText,
				});
			}
		}
	}

	return completions;
}

function doSassDocParameterCompletion(textAfterCursor: string, context: 'function' | 'mixin'): CompletionList{
	const completions = CompletionList.create([], true);
	const tokens = tokenizer(textAfterCursor);

	const isCursorAboveMixinWithParameters = textAfterCursor.match(/^(?:\r\n|\r|\n)\s*@mixin .+\(.+\)/);
	if (context === 'mixin' && !isCursorAboveMixinWithParameters) {
		// If this is a mixin without parameters we don't have many options for clever suggestions.
		// Look for a @content, but otherwise just suggest an @output and a description.

		let hasContentDirective = false;
		let bracketCount = 0;
		const openBracket = tokens.findIndex(t => t[0] === '{');
		for (let i = openBracket; i < tokens.length; i++) {
			const token = tokens[i];
			if (token[0] === '{') {
				bracketCount++;
			} else if (token[0] === '}') {
				bracketCount--;
				if (bracketCount === 0) {
					break;
				}
			}

			if (token[1] === '@content') {
				hasContentDirective = true;
				break;
			}
		}

		const contentSnippet = hasContentDirective ? '\n/// @content ${1}' : '';
		const snippet = ` \${0}${contentSnippet}\n/// @output \${2}`;

		completions.items.push({
			label: 'SassDoc block',
			insertText: snippet,
			insertTextFormat: InsertTextFormat.Snippet,
			sortText: '-'
		});

		return completions;
	}

	const [_, text] = tokens.find(t => t[0] === 'brackets') as ['brackets', string, number];

	const ppl = 2; // Number of placeholders in the /// @param snippet below

	const parameters = text.replace(/[()]/g, "").split(",");
	const parameterSnippet: string = parameters.map((p, i) => {
		let [parameterName, defaultValue] = p.split(":").map(nd => nd.trim()) as [string, string | undefined];

		let typeSnippet = 'type';
		let defaultValueSnippet = '';
		if (defaultValue) {
			defaultValueSnippet =  ` [${defaultValue}]`;

			// Try to give a sensible default type if we can
			try {
				if (defaultValue === 'true' || defaultValue === 'false') {
					typeSnippet = 'Boolean';
				} else if (defaultValue.match(/^["']/)) {
					typeSnippet = 'String'
				} else if (defaultValue.startsWith('#') || defaultValue.startsWith('rgb')  || defaultValue.startsWith('hsl')) {
					typeSnippet = 'Color';
				} else {
					const maybeNumber = Number.parseFloat(defaultValue);
					if (!Number.isNaN(maybeNumber)) {
						typeSnippet = 'Number';
					}
				}
			} catch (e) {
				// Oops! Carry on with a generic suggestion.
			}
		}

		return `/// @param {\${${(i * ppl) + 1}:${typeSnippet}}} \\${parameterName}${defaultValueSnippet} \${${(i * ppl) + 2}:-}`;
	}).join('\n');

	const isFunc = context === 'function';
	const returnSnippet = `\n/// @${isFunc ? `return {\${${(ppl * parameters.length) + 1}:type}}` : 'output'} \${${(ppl * parameters.length) + 2}:-}`;
	const snippet = ` \${0}\n${parameterSnippet}${returnSnippet}`;

	completions.items.push({
		label: 'SassDoc block',
		insertText: snippet,
		insertTextFormat: InsertTextFormat.Snippet,
		sortText: '-'
	});

	return completions;
}
