import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
	"./packages/language-services/vitest.config.mts",
	"./packages/language-server/vitest.config.mts",
	"./packages/parser/vitest.config.mts",
	"./packages/language-facts/vitest.config.mts",
]);
