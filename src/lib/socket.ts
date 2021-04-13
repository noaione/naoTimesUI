import net from "net";
import path from "path";
import { promisify } from "util";

import dotenv from "dotenv";

import { logger as MainLoggger } from "./logger";
import { isNone } from "./utils";

const sleep = promisify(setTimeout);

const logger = MainLoggger.child({ cls: "SocketConn" });
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });
logger.info(`Preparing a saved host:port at ${process.env.BOT_SOCKET_HOST}:${process.env.BOT_SOCKET_PORT}`);
type SocketEvent =
    | "authenticate"
    | "pull data"
    | "pull admin"
    | "get server"
    | "get channel"
    | "get user"
    | "get user perms"
    | "delete server"
    | "delete admin"
    | "delete role"
    | "delete roles"
    | "create role"
    | "announce drop"
    | "ping";
type MockSocketEvent = `mock ${SocketEvent}`;

function createNewSocket() {
    const HOST = process.env.BOT_SOCKET_HOST || "127.0.0.1";
    const PORT = process.env.BOT_SOCKET_PORT || 25670;
    if (!HOST || !PORT) {
        throw new Error(`emitSocket: Invalid configuration for BotSocket\nClient: ${HOST}:${PORT}`);
    }
    // @ts-ignore
    const PORTNUM = parseInt(PORT);
    if (Number.isNaN(PORTNUM)) {
        throw new Error(`createBotClient: Port is not a number`);
    }
    const client = new net.Socket();
    client.connect({
        host: HOST,
        port: PORTNUM,
    });
    client.setEncoding("utf-8");
    return client;
}

export function emitSocket(event: SocketEvent | MockSocketEvent, data: any) {
    const client = createNewSocket();
    // eslint-disable-next-line no-underscore-dangle
    const _logger = MainLoggger.child({ cls: "SocketConn", fn: "emitSocket" });

    client.on("connect", () => {
        const addr = client.address();
        _logger.info("Connectioon established!");
        _logger.info("Client Info:");
        // @ts-ignore
        _logger.info(`Listening at port: ${addr.port}`);
        // @ts-ignore
        const ipaddr = addr.address;
        _logger.info(`Client IP:${ipaddr}`);

        client.write(`${JSON.stringify({ event, data })}\x04`);
        _logger.info(`Sending event ${event} with data ${JSON.stringify({ event, data })}`);
        client.end();
    });
}

export async function emitSocketAndWait(event: SocketEvent | MockSocketEvent, data: any) {
    const client = createNewSocket();
    // eslint-disable-next-line no-underscore-dangle
    const _logger = MainLoggger.child({ cls: "SocketConn", fn: "emitSocket" });

    let isConnected = false;
    let queryResponse: Buffer;
    client.on("connect", () => {
        isConnected = true;
        const addr = client.address();
        _logger.info("Connectioon established!");
        _logger.info("Client Info:");
        // @ts-ignore
        _logger.info(`Listening at port: ${addr.port}`);
        // @ts-ignore
        const ipaddr = addr.address;
        _logger.info(`Client IP:${ipaddr}`);

        client.write(`${JSON.stringify({ event, data })}\x04`);
        _logger.info(`Sending event ${event} with data ${JSON.stringify({ event, data })}`);
    });

    client.on("data", (sdata) => {
        queryResponse = sdata;
        client.end();
    });

    while (!isConnected) {
        await sleep(500);
    }
    while (isNone(queryResponse)) {
        await sleep(500);
    }
    _logger.info(`Received answer for event ${event}: ${queryResponse}`);
    let parsedData = queryResponse.toString();
    if (parsedData.endsWith("\x04")) {
        parsedData = parsedData.replace("\x04", "");
    }
    const JSONified = JSON.parse(parsedData);
    if (JSONified.success === 0) {
        throw new Error(JSONified.message);
    }
    if (JSONified.success === -1) {
        // Need auth, redo the whole thing.
        if (isNone(process.env.BOT_SOCKET_PASSWORD)) {
            _logger.error("Server requested authentication but there's no password provided");
            throw new Error("Bot socket need authentication and there's no provided password in ENV file");
        }
        try {
            _logger.info("Server requested authentication, authenticating with provided password");
            await emitSocketAndWait("authenticate", process.env.BOT_SOCKET_PASSWORD);
        } catch (e) {
            throw new Error("Wrong password for authenticating, cannot emit the original event");
        }
        try {
            _logger.info("Authentication completed, emitting the original event again.");
            return await emitSocketAndWait(event, data);
        } catch (e) {
            throw new Error(e.toString().replace("Error: ", ""));
        }
    }
    return JSONified.message;
}
