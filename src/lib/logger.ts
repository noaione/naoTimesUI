import { errorLogger as WinstonErrorLog, logger as WinstonLog } from "express-winston";
import _ from "lodash";
import winston, { createLogger } from "winston";

const reqTypeColor = {
    GET: "\u001b[32m",
    POST: "\u001b[36m",
    PUT: "\u001b[35m",
    PATCH: "\u001b[33m",
    DELETE: "\u001b[31m",
    HEAD: "\u001b[37m",
};

const GRAY = "\u001b[90m";
const RESET = "\u001b[39m";

function wrapColor(text: string, color: string) {
    return `${color}${text}${RESET}`;
}

interface WinstonLogInfo extends winston.Logform.TransformableInfo {
    timestamp?: string;
    /*
        Use square format for class and function name
        Rather than functionName() it will be [functionName]
        Rather than ClassName.functionName() it will be [ClassName.functionName]
    */
    squared?: boolean;
    // Class name
    cls?: string;
    // Function name
    fn?: string;
}

export const logger = createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize({ level: true, message: false }),
        winston.format.timestamp(),
        winston.format.printf((info: WinstonLogInfo) => {
            let initformat = `[${wrapColor(info["timestamp"], GRAY)}][${info.level}]`;
            const squareMode = _.get(info, "squared", false);
            if (squareMode) {
                initformat += "[";
            } else {
                initformat += " ";
            }
            const hasCls = _.has(info, "cls");
            if (hasCls) {
                initformat += wrapColor(info["cls"], "\u001b[35m");
            }
            if (_.has(info, "fn")) {
                if (hasCls) {
                    initformat += ".";
                }
                initformat += wrapColor(info["fn"], "\u001b[36m");
            }
            if (squareMode) {
                initformat += "]";
            } else {
                initformat += "()";
            }
            return initformat + `: ${info.message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

export const expressLogger = WinstonLog({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.printf((info) => {
            const method = info.meta.req.method;
            const methodCol = _.get(reqTypeColor, method, "");
            const statCode = info.meta.res.statusCode;
            const HTTP_VER = info.meta.req.httpVersion || "1.1";
            // Base
            let fmtRes = `[${wrapColor(info["timestamp"], GRAY)}][${info.level}]: `;
            fmtRes += `${wrapColor("HTTP", "\u001b[32m")} ${HTTP_VER}`;
            // Method
            fmtRes += ` ${methodCol}${method}${RESET} `;
            // PATH
            fmtRes += info.meta.req.url;
            // Status Code
            let statCol = RESET;
            if (statCode >= 200 && statCode < 300) {
                statCol = reqTypeColor["GET"];
            } else if (statCode >= 300 && statCode < 400) {
                statCol = reqTypeColor["PATCH"];
            } else if (statCode >= 400) {
                statCol = reqTypeColor["DELETE"];
            }
            fmtRes += `  ${statCol}${statCode}${RESET}`;
            fmtRes += ` (${reqTypeColor["PATCH"]}${info["meta"]["responseTime"]}${RESET}ms)`;
            return fmtRes;
        })
    ),
});

export const expressErrorLogger = WinstonErrorLog({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.printf((info) => {
            const method = info.meta.req.method;
            const HTTP_VER = info.meta.req.httpVersion || "1.1";
            const methodCol = _.get(reqTypeColor, method, "");
            const statCode = 500;
            // Base
            // eslint-disable-next-line max-len
            let fmtRes = `[${wrapColor(info["timestamp"], GRAY)}][${info.level}]: `;
            fmtRes += `${wrapColor("HTTP", "\u001b[32m")} ${HTTP_VER}`;
            // Method
            fmtRes += ` ${methodCol}${method}${RESET} `;
            // PATH
            fmtRes += info.meta.req.url;
            // Status Code
            let statCol = RESET;
            if (statCode >= 200 && statCode < 300) {
                statCol = reqTypeColor["GET"];
            } else if (statCode >= 300 && statCode < 400) {
                statCol = reqTypeColor["PATCH"];
            } else if (statCode >= 400) {
                statCol = reqTypeColor["DELETE"];
            }
            fmtRes += `  ${statCol}${statCode}${RESET}`;
            return fmtRes + "\n" + info.meta.message;
        })
    ),
});
