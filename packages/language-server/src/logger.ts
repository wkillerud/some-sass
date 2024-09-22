import type { Connection } from "vscode-languageserver";

export interface Logger {
	fatal(message: string): void;
	error(message: string): void;
	warn(message: string): void;
	info(message: string): void;
	debug(message: string): void;
	trace(message: string): void;
	/**
	 * Accepts the same levels as [pino](https://getpino.io/#/docs/api?id=level-string)
	 */
	setLogLevel(level: string): void;
}

const fatal = 1;
const error = 2;
const warn = 3;
const info = 4;
const debug = 5;
const trace = 6;
const silent = 0;

function levelToRank(level: string): number {
	switch (level) {
		case "fatal":
			return fatal;
		case "error":
			return error;
		case "warn":
			return warn;
		case "debug":
			return debug;
		case "trace":
			return trace;
		case "silent":
			return silent;
		case "info":
		default:
			return info;
	}
}

class LoggerImpl implements Logger {
	#connection: Connection;
	#level: number = levelToRank("info");

	constructor(connection: Connection) {
		this.#connection = connection;
		try {
			const levelArg = process.argv.indexOf("--loglevel");
			if (levelArg !== -1) {
				this.#level = levelToRank(process.argv[levelArg + 1]);
			}
		} catch {}
	}

	setLogLevel(level: string): void {
		this.#level = levelToRank(level);
	}

	fatal(message: string): void {
		if (this.#level <= fatal) {
			this.#connection.console.error(message);
		}
	}

	error(message: string): void {
		if (this.#level <= error) {
			this.#connection.console.error(message);
		}
	}

	warn(message: string): void {
		if (this.#level <= warn) {
			this.#connection.console.warn(message);
		}
	}

	info(message: string): void {
		if (this.#level <= info) {
			this.#connection.console.info(message);
		}
	}

	debug(message: string): void {
		if (this.#level <= debug) {
			this.#connection.console.debug(message);
		}
	}

	trace(message: string): void {
		if (this.#level <= trace) {
			this.#connection.console.debug(message);
		}
	}
}

export function createLogger(connection: Connection): Logger {
	return new LoggerImpl(connection);
}
