import { CompletionList, MarkupKind } from 'vscode-languageserver';
import { sassBuiltInModules } from '../../sassBuiltInModules';

import type { CompletionContext } from './completion-context';

const rePartialUse = /^@use (?:"|')/;

export function doImportCompletion(context: CompletionContext): CompletionList {
  const completions = CompletionList.create([], false);

  if (rePartialUse.test(context.textBeforeWord)) {
    completions.items = Object.entries(sassBuiltInModules).map(([moduleName, { summary, reference }]) => ({
      label: moduleName,
      documentation: {
        kind: MarkupKind.Markdown,
        value: [
          summary,
          '',
          `[Sass reference](${reference})`,
        ].join('\n'),
      },
    }));
  }

  return completions;
}