import http from "http";

import { eventsEmit } from "./lib/events";
import { emitSocketAndWait } from "./lib/socket";
import { createSocketIO } from "./lib/socketio";
import { isNone } from "./lib/utils";
import { app, logger, sessionMiddleware, SOCKET_PASSWD } from "./server";

const httpServer = http.createServer(app);
const io = createSocketIO(httpServer, sessionMiddleware);

eventsEmit.on("notifforward", (data) => {
    logger.info("Event notifforward received, parsing...");
    const dataParsed = JSON.parse(data);
    logger.info(`Forwarding to ${dataParsed.id}`);
    io.emit(`notificationpush-${dataParsed.id}`, JSON.stringify(dataParsed.data));
});

eventsEmit.on("forcenuke", (data) => {
    if (io.of("/").sockets.get(data)) {
        logger.info(`Force disconnecting ${data}`);
        io.of("/").sockets.get(data).disconnect(true);
    }
});

if (!isNone(SOCKET_PASSWD)) {
    logger.info("Authenticating to Bot socket...");
    emitSocketAndWait("authenticate", SOCKET_PASSWD).then((res: any) => {
        if (res === "ok") {
            httpServer.listen(5000, () => {
                logger.info("🚀 App now running at port http://127.0.0.1:5000");
            });
        } else {
            logger.error("Failed to authenticate to bot socket, please check");
        }
    });
} else {
    httpServer.listen(5000, () => {
        logger.info("🚀 App now running at port http://127.0.0.1:5000");
    });
}

export { io };
