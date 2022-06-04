import { CompletionList } from 'vscode-languageserver';
import { sassBuiltInModules } from '../../sassBuiltInModules';

import type { CompletionContext } from './completion-context';

const rePartialUse = /^@use (?:"|')/;

export function doImportCompletion(context: CompletionContext): CompletionList {
  const completions = CompletionList.create([], false);

  if (rePartialUse.test(context.textBeforeWord)) {
    completions.items = Object.entries(sassBuiltInModules).map(([moduleName, { summary }]) => ({
      label: moduleName,
      detail: summary,
    }));
  }

  return completions;
}