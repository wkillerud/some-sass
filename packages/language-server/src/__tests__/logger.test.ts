import { assert, test, vi } from "vitest";
import { createLogger } from "../logger";

test("default log level is info", () => {
	const remote = {
		debug: vi.fn(),
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
	};
	const log = createLogger(remote);

	log.trace("hello");
	log.debug("hello");
	log.info("hello");
	log.warn("hello");
	log.error("hello");
	log.fatal("hello");

	assert.equal(remote.debug.mock.calls.length, 0);
	assert.equal(remote.info.mock.calls.length, 1);
	assert.equal(remote.warn.mock.calls.length, 1);
	assert.equal(remote.error.mock.calls.length, 2);
});

test("trace logs all the things", () => {
	const remote = {
		debug: vi.fn(),
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
	};
	const log = createLogger(remote);
	log.setLogLevel("trace");

	log.trace("hello");
	log.debug("hello");
	log.info("hello");
	log.warn("hello");
	log.error("hello");
	log.fatal("hello");

	assert.equal(remote.debug.mock.calls.length, 2);
	assert.equal(remote.info.mock.calls.length, 1);
	assert.equal(remote.warn.mock.calls.length, 1);
	assert.equal(remote.error.mock.calls.length, 2);
});

test("warn logs warn, error and fatal", () => {
	const remote = {
		debug: vi.fn(),
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
	};
	const log = createLogger(remote);
	log.setLogLevel("warn");

	log.trace("hello");
	log.debug("hello");
	log.info("hello");
	log.warn("hello");
	log.error("hello");
	log.fatal("hello");

	assert.equal(remote.debug.mock.calls.length, 0);
	assert.equal(remote.info.mock.calls.length, 0);
	assert.equal(remote.warn.mock.calls.length, 1);
	assert.equal(remote.error.mock.calls.length, 2);
});

test("error logs error and fatal", () => {
	const remote = {
		debug: vi.fn(),
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
	};
	const log = createLogger(remote);
	log.setLogLevel("error");

	log.trace("hello");
	log.debug("hello");
	log.info("hello");
	log.warn("hello");
	log.error("hello");
	log.fatal("hello");

	assert.equal(remote.debug.mock.calls.length, 0);
	assert.equal(remote.info.mock.calls.length, 0);
	assert.equal(remote.warn.mock.calls.length, 0);
	assert.equal(remote.error.mock.calls.length, 2);
});

test("silent logs nothing", () => {
	const remote = {
		debug: vi.fn(),
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
	};
	const log = createLogger(remote);
	log.setLogLevel("silent");

	log.trace("hello");
	log.debug("hello");
	log.info("hello");
	log.warn("hello");
	log.error("hello");
	log.fatal("hello");

	assert.equal(remote.debug.mock.calls.length, 0);
	assert.equal(remote.info.mock.calls.length, 0);
	assert.equal(remote.warn.mock.calls.length, 0);
	assert.equal(remote.error.mock.calls.length, 0);
});
