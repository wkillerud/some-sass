import { CompletionList } from 'vscode-languageserver';

import type { TextDocument } from 'vscode-languageserver-textdocument';
import type StorageService from '../../services/storage';
import type { ISettings } from '../../types/settings';
import type { CompletionContext } from './completion-context';

export function doImportCompletion(_: TextDocument, __: ISettings, ___: CompletionContext, ____: StorageService): CompletionList {
	const completions = CompletionList.create([], false);

  return completions;
}