import assert from 'assert';
import { DiagnosticSeverity, DiagnosticTag } from 'vscode-languageserver-types';
import { EXTENSION_NAME } from '../../../constants';

import { doDiagnostics } from '../../providers/diagnostics';
import StorageService from '../../services/storage';
import * as helpers from '../helpers';

const storage = new StorageService();

describe("Providers/Diagnostics", () => {
  it("doDiagnostics - Variables", async () => {
    const document = await helpers.makeDocument(storage, [
      "/// @deprecated Use something else",
      "$a: 1;",
      ".a { content: $a; }",
    ]);

    const actual = await doDiagnostics(document, storage);

    assert.deepStrictEqual(actual, [
      {
        message: "Use something else",
        range: {
          start: { line: 2, character: 14 },
          end: { line: 2, character: 16 },
        },
        source: EXTENSION_NAME,
        tags: [DiagnosticTag.Deprecated],
        severity: DiagnosticSeverity.Hint,
      }
    ]);
  });

  it("doDiagnostics - Functions", async () => {
    const document = await helpers.makeDocument(storage, [
      "/// @deprecated Use something else",
      "@function old-function() {",
      "  @return 1;",
      "}",
      ".a { content: old-function(); }",
    ]);

    const actual = await doDiagnostics(document, storage);

    assert.deepStrictEqual(actual, [
      {
        message: "Use something else",
        range: {
          start: { line: 4, character: 14 },
          end: { line: 4, character: 28 },
        },
        source: EXTENSION_NAME,
        tags: [DiagnosticTag.Deprecated],
        severity: DiagnosticSeverity.Hint,
      }
    ]);
  });

  it("doDiagnostics - Mixins", async () => {
    const document = await helpers.makeDocument(storage, [
      "/// @deprecated Use something else",
      "@mixin old-mixin {",
      "  content: 'mixin';",
      "}",
      ".a { @include old-mixin(); }",
    ]);

    const actual = await doDiagnostics(document, storage);

    assert.deepStrictEqual(actual, [
      {
        message: "Use something else",
        range: {
          start: { line: 4, character: 5 },
          end: { line: 4, character: 25 },
        },
        source: EXTENSION_NAME,
        tags: [DiagnosticTag.Deprecated],
        severity: DiagnosticSeverity.Hint,
      }
    ]);
  });

  it("doDiagnostics - all of the above", async () => {
    const document = await helpers.makeDocument(storage, [
      "/// @deprecated Use something else",
      "$a: 1;",
      ".a { content: $a; }",
      "",
      "/// @deprecated Use something else",
      "@function old-function() {",
      "  @return 1;",
      "}",
      ".a { content: old-function(); }",
      "",
      "/// @deprecated Use something else",
      "@mixin old-mixin {",
      "  content: 'mixin';",
      "}",
      ".a { @include old-mixin(); }",
    ]);

    const actual = await doDiagnostics(document, storage);

    assert.strictEqual(actual.length, 3);

    assert.ok(actual.every(d => Boolean(d.message)), "Every diagnostic must have a message");
  });

  it("doDiagnostics - support annotation without description", async () => {
    const document = await helpers.makeDocument(storage, [
      "/// @deprecated",
      "$a: 1;",
      ".a { content: $a; }",
      "",
      "/// @deprecated",
      "@function old-function() {",
      "  @return 1;",
      "}",
      ".a { content: old-function(); }",
      "",
      "/// @deprecated",
      "@mixin old-mixin {",
      "  content: 'mixin';",
      "}",
      ".a { @include old-mixin(); }",
    ]);

    const actual = await doDiagnostics(document, storage);

    assert.strictEqual(actual.length, 3);

    // Make sure we set a default message for the deprecated tag
    assert.ok(actual.every(d => Boolean(d.message)), "Every diagnostic must have a message");
  });
});
