export enum LOG_LEVEL {
	TRACE,
	DEBUG,
	INFO,
	WARN,
	ERROR,
	FATAL,
}

function getLogLevelString(level: LOG_LEVEL): string {
	switch (level) {
		case LOG_LEVEL.DEBUG:
			return "DEBUG";
		case LOG_LEVEL.INFO:
			return "INFO";
		case LOG_LEVEL.WARN:
			return "WARN";
		case LOG_LEVEL.ERROR:
			return "ERROR";
		case LOG_LEVEL.FATAL:
			return "FATAL";
	}
}

export interface LoggerSettings {
	level: LOG_LEVEL;
	useStdErr: boolean;
}

// Really should make use of async nature, and one demand logging stuff etc.
// Like, create an interface for a logger method + some settings, and just
// use that. Also, fire off log events async, event also needs an interface.
class Logger {

	private level: LOG_LEVEL = LOG_LEVEL.INFO;
	private useStdErr: boolean = false;

	public setLogLevel(level: LOG_LEVEL) {
		this.level = level;
	}

	public setUseStdErr(useStdErr: boolean) {
		this.useStdErr = useStdErr;
	}

	log_console(level: LOG_LEVEL, line: string) {
		if (level < this.level) return;

		const formattedLine: string = `${new Date().toISOString()} - ${getLogLevelString(level)} - ${line}`

		if (level > LOG_LEVEL.INFO && this.useStdErr) {
			console.error(formattedLine)
		}
		else {
			console.log(formattedLine)
		}
	}

	public log(level: LOG_LEVEL, line: string) {
		// Only support console at first.
		this.log_console(level, line);
	}
}

const logger = new Logger();

export async function log(level: LOG_LEVEL, line: string) {
	logger.log(level, line);
}

export async function debug(line: string) {
	log(LOG_LEVEL.DEBUG, line);
}

export async function info(line: string) {
	log(LOG_LEVEL.INFO, line);
}

export async function warn(line: string) {
	log(LOG_LEVEL.WARN, line);
}

export async function error(line: string) {
	log(LOG_LEVEL.ERROR, line);
}

export async function fatal(line: string) {
	log(LOG_LEVEL.FATAL, line);
}

let loggerSettingsInitialized: boolean = false;

export function setLoggerSettings(settings: LoggerSettings, overwrite: boolean = false) {
	// TODO: return vs throw error?
	if (loggerSettingsInitialized && !overwrite) return;
	logger.setLogLevel(settings.level);
	logger.setUseStdErr(settings.useStdErr);
	loggerSettingsInitialized = true;
}
