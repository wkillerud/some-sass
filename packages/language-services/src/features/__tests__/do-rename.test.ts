import { assert, test } from "vitest";
import { Position, getLanguageService } from "../../language-services";
import { getOptions } from "../../utils/test-helpers";

const { fileSystemProvider, ...rest } = getOptions();
const ls = getLanguageService({ fileSystemProvider, ...rest });

test.todo("renames include the declaration");
