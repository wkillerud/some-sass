import { test, assert } from "vitest";
import { URI } from "../../language-services-types";
import { getName } from "../uri";

test("getName gets file names including extensions", () => {
	assert.equal(
		getName(URI.parse("vscode-test-web://mount/foo.scss")),
		"foo.scss",
	);
});

test("getName gets directory names excluding preceeding and trailing slash", () => {
	assert.equal(getName(URI.parse("vscode-test-web://mount/foo/")), "foo");
});
