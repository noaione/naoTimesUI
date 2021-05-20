import net from "net";
import { promisify } from "util";

import { isNone } from "./utils";

const sleep = promisify(setTimeout);

type CheckMethodEvent = "authenticate" | "ping";
type GetMethodEvent = "get server" | "get channel" | "get user" | "get user perms" | "get server channel";
type UpdateMethodEvent = "pull data" | "pull admin";
type DeleteMethodEvent = "delete server" | "delete admin" | "delete role" | "delete roles" | "announce drop";
type CreateMethodEvent = "create role";

type FansubRSSEvent = "fsrss get" | "fsrss parse" | "fsrss update" | "fsrss create" | "fsrss delete";

type SocketEvent =
    | CheckMethodEvent
    | GetMethodEvent
    | UpdateMethodEvent
    | DeleteMethodEvent
    | CreateMethodEvent
    | FansubRSSEvent;
type MockSocketEvent = `mock ${SocketEvent}`;

function createNewSocket() {
    const HOST = process.env.BOT_SOCKET_HOST ?? "127.0.0.1";
    const PORT = process.env.BOT_SOCKET_PORT ?? 25670;
    if (!HOST || !PORT) {
        throw new Error(`emitSocket: Invalid configuration for BotSocket\nClient: ${HOST}:${PORT}`);
    }
    // @ts-ignore
    const PORTNUM = parseInt(PORT);
    if (Number.isNaN(PORTNUM)) {
        throw new Error(`createBotClient: Port is not a number`);
    }
    try {
        const client = new net.Socket();
        client.connect({
            host: HOST,
            port: PORTNUM,
        });
        client.setEncoding("utf-8");
        return client;
    } catch (e) {
        throw new Error("Connection error occured!");
    }
}

export function emitSocket(event: SocketEvent | MockSocketEvent, data: any) {
    const client = createNewSocket();

    client.on("connect", () => {
        client.write(`${JSON.stringify({ event, data, auth: process.env.BOT_SOCKET_PASSWORD ?? "" })}\x04`);
        client.end();
    });
}

export async function emitSocketAndWait(event: SocketEvent | MockSocketEvent, data: any): Promise<any> {
    const client = createNewSocket();
    // eslint-disable-next-line no-underscore-dangle

    let isConnected = false;
    let parsedData = "";
    let isDone = false;
    client.on("connect", () => {
        isConnected = true;
        client.write(`${JSON.stringify({ event, data })}\x04`);
    });

    client.on("data", (sdata) => {
        const parseWhile = sdata.toString();
        parsedData += parseWhile;
        if (parseWhile.endsWith("\x04")) {
            isDone = true;
            client.end();
        }
    });

    client.on("end", () => {
        isDone = true;
    });
    let isTimeout = false;
    const TIMEOUT_LIMIT = 10 * 1000;
    let CURRENT_TIMEOUT = 0;
    while (!isConnected) {
        await sleep(500);
        CURRENT_TIMEOUT += 500;
        if (CURRENT_TIMEOUT >= TIMEOUT_LIMIT) {
            isTimeout = true;
            break;
        }
    }
    if (isTimeout) {
        throw new Error("Timeout error after 10 seconds of waiting for connection!");
    }
    CURRENT_TIMEOUT = 0;
    while (!isDone) {
        await sleep(500);
        CURRENT_TIMEOUT += 500;
        if (CURRENT_TIMEOUT >= TIMEOUT_LIMIT) {
            isTimeout = true;
            break;
        }
    }
    if (isTimeout) {
        throw new Error("Timeout error after 10 seconds of waiting for answer!");
    }
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
            throw new Error("Bot socket need authentication and there's no provided password in ENV file");
        }
        try {
            await emitSocketAndWait("authenticate", process.env.BOT_SOCKET_PASSWORD);
        } catch (e) {
            throw new Error("Wrong password for authenticating, cannot emit the original event");
        }
        try {
            return await emitSocketAndWait(event, data);
        } catch (e) {
            throw new Error(e.toString().replace("Error: ", ""));
        }
    }
    return JSONified.message;
}
