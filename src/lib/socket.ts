import dotenv from "dotenv";
import net from "net";
import path from "path";
import { promisify } from "util";

import { logger as MainLoggger } from "./logger";
import { isNone } from "./utils";
const sleep = promisify(setTimeout);

const logger = MainLoggger.child({ cls: "SocketConn" });
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });
logger.info(`Preparing a saved host:port at ${process.env.BOT_SOCKET_HOST}:${process.env.BOT_SOCKET_PORT}`);
type SocketEvent =
    | "authenticate"
    | "pull data"
    | "get server"
    | "get user"
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
    if (isNaN(PORTNUM)) {
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

    client.on("connect", function () {
        const addr = client.address();
        logger.info("Connectioon established!");
        logger.info("Client Info:");
        // @ts-ignore
        logger.info(`Listening at port: ${addr.port}`);
        // @ts-ignore
        const ipaddr = addr.address;
        logger.info("Client IP:" + ipaddr);

        client.write(JSON.stringify({ event: event, data: data }) + "\x04");
        client.end();
    });
}

export async function emitSocketAndWait(event: SocketEvent | MockSocketEvent, data: any) {
    const client = createNewSocket();

    let isConnected = false;
    let queryResponse: Buffer;
    client.on("connect", function () {
        isConnected = true;
        const addr = client.address();
        logger.info("Connectioon established!");
        logger.info("Client Info:");
        // @ts-ignore
        logger.info(`Listening at port: ${addr.port}`);
        // @ts-ignore
        const ipaddr = addr.address;
        logger.info("Client IP:" + ipaddr);

        client.write(JSON.stringify({ event: event, data: data }) + "\x04");
    });

    client.on("data", function (data) {
        queryResponse = data;
        client.end();
    });

    while (!isConnected) {
        await sleep(500);
    }
    while (isNone(queryResponse)) {
        await sleep(500);
    }
    logger.info(`Received answer for event ${event}: ${queryResponse}`);
    let parsedData = queryResponse.toString();
    if (parsedData.endsWith("\x04")) {
        parsedData = parsedData.replace("\x04", "");
    }
    const JSONified = JSON.parse(parsedData);
    if (JSONified.success === -1) {
        // Need auth, redo the whole thing.
        if (isNone(process.env.BOT_SOCKET_PASSWORD)) {
            logger.error("Server requested authentication but there's no password provided");
            throw new Error("Bot socket need authentication and there's no provided password in ENV file");
        }
        try {
            logger.info("Server requested authentication, authenticating with provided password");
            await emitSocketAndWait("authenticate", process.env.BOT_SOCKET_PASSWORD);
            logger.info("Authentication completed, emitting the original event again.");
            return await emitSocketAndWait(event, data);
        } catch (e) {
            throw new Error("Wrong password for authenticating, cannot emit the original event");
        }
    }
    if (JSONified.success !== 1) {
        throw new Error(JSONified.message);
    }
    return JSONified.message;
}
