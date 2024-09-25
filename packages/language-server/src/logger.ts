import type { RemoteConsole } from "vscode-languageserver";

export type RemoteLogger = Pick<
	RemoteConsole,
	"debug" | "info" | "warn" | "error"
>;

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
	#remoteConsole: RemoteLogger;
	#level: number = levelToRank("info");

	constructor(remoteConsole: RemoteLogger) {
		this.#remoteConsole = remoteConsole;
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
		if (this.#level >= fatal) {
			this.#remoteConsole.error(message);
		}
	}

	error(message: string): void {
		if (this.#level >= error) {
			this.#remoteConsole.error(message);
		}
	}

	warn(message: string): void {
		if (this.#level >= warn) {
			this.#remoteConsole.warn(message);
		}
	}

	info(message: string): void {
		if (this.#level >= info) {
			this.#remoteConsole.info(message);
		}
	}

	debug(message: string): void {
		if (this.#level >= debug) {
			this.#remoteConsole.debug(message);
		}
	}

	trace(message: string): void {
		if (this.#level >= trace) {
			this.#remoteConsole.debug(message);
		}
	}
}

export function createLogger(remoteConsole: RemoteLogger): Logger {
	return new LoggerImpl(remoteConsole);
}
