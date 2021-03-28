import net from "net";
import { promisify } from "util";

import { logger as MainLoggger } from "./logger";
import { isNone } from "./utils";
const sleep = promisify(setTimeout);

const logger = MainLoggger.child({ cls: "SocketConn" });

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

export function emitSocket(event: string, data: any) {
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

export async function emitSocketAndWait(event: string, data: any) {
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
    if (JSONified.success !== 1) {
        throw new Error(JSONified.message);
    }
    return JSONified.message;
}
