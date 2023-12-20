import winston from "winston";

export function CreateLogger(parentName: string, moduleName: string) {
    return winston.createLogger({
        level: "debug",
        transports: [
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
};