import type { Diagnostic, VersionedTextDocumentIdentifier } from 'vscode-languageserver-types';
import type StorageService from '../services/storage';

// interface Diagnostic {
//   /**
//    * The range at which the message applies
//    */
//   range: Range;
//   /**
//    * A human-readable string describing the source of this
//    * diagnostic, e.g. 'typescript' or 'super lint'. It usually
//    * appears in the user interface.
//    */
//   source?: string; // TODO: "Some Sass"
//   /**
//    * The diagnostic's message. It usually appears in the user interface
//    */
//   message: string;
//   /**
//    * Additional metadata about the diagnostic.
//    *
//    * @since 3.15.0
//    */
//   tags?: DiagnosticTag[]; // TODO: Deprecated er en gyldig verdi her
// }

export async function doDiagnostics(
  document: VersionedTextDocumentIdentifier,
  storage: StorageService
): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];
  // 1. find all symbols (i. e. scanner)
  // 2. find all symbols that are deprecated (i. e. scanner should have this info)
  // 3. find all ranges of deprecated symbols
  return diagnostics;
}