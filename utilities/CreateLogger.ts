import winston from "winston";
import {Syslog} from "winston-syslog";
import LoadConfig from "./ConfigLoader";

const Config = LoadConfig;

export function CreateLogger(parentName: string, moduleName: string) {
	const papertrail = new Syslog({
		host: Config.Papertrail.ConnectionURL,
		port: Config.Papertrail.ConnectionPort,
		protocol: "tls4",
		localhost: "sparkles-runner-1",
		eol: "\n",
		level: "debug"
	});

	const logger = winston.createLogger({
		// level: "debug",
		transports: [
			papertrail,
			new winston.transports.Console({
				level: "info",
				format: winston.format.combine(winston.format.colorize(), winston.format.simple(), winston.format.timestamp())
			}),
			new winston.transports.File({
				filename: `./logs/${parentName}/${moduleName}_error.log`, level: "warn", format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.json()
				)
			}),
			new winston.transports.File({
				filename: `./logs/${parentName}/${moduleName}.log`, level: "debug", format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.json()
				)
			})
		]
	});

	logger.on("warn", (e) => console.log("warning! " + e));

	return logger;
}