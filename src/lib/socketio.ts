import http from "http";

import { Request, RequestHandler } from "express";
import _ from "lodash";
import { Server, Socket } from "socket.io";

import { logger as MainLogger } from "./logger";
import { passport } from "./passport";
import createRedisClient, { RedisDB } from "./redis";

const TopLogger = MainLogger.child({ cls: "SocketIO" });

const wrap = (middleware: RequestHandler) => (socket: Socket, next: Function) =>
    // @ts-ignore
    middleware(socket.request as Request, {}, next);
const RedisClient = createRedisClient(true) as RedisDB;

export function createSocketIO(server: http.Server, sessionMiddleware: RequestHandler) {
    const io = new Server(server);
    io.use(wrap(sessionMiddleware));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    io.use((socket, next) => {
        // @ts-ignore
        if (socket.request.user) {
            next();
        } else {
            next(new Error("Unauathorized"));
        }
    });

    io.on("connection", (socket) => {
        const logger = TopLogger.child({ fn: "ConnectionOpened" });
        logger.info(`Connection established with ID: ${socket.id}`);
        socket.on("disconnect", () => {
            logger.info(`Socket ID ${socket.id} disconnected!`);
        });

        socket.on("notificationread", (data) => {
            const logger2 = TopLogger.child({ fn: "NotificationRead" });
            const parsed = JSON.parse(data);
            const notificationIds = parsed.id;
            // @ts-ignore
            const userId = socket.request.user.id;
            logger2.info(`Received notification read from user ${userId} of ID ${notificationIds}`);
            RedisClient.set(
                `ntpnotif_${userId}_${notificationIds}`,
                JSON.stringify({ id: notificationIds, msg: parsed.msg, read: true, ts: parsed.ts })
            )
                .then((_s) => {
                    logger2.info("Successfully marked as read!");
                })
                .catch((_e) => {
                    logger2.error("An error occured while trying to set as read, ignoring...");
                });
        });

        // @ts-ignore
        const { session } = socket.request;
        logger.info(`Saving Socket ID ${socket.id} in session ${session.id}`);
        session.socketId = socket.id;
        session.save();

        // @ts-ignore
        const userId = socket.request.user.id;

        logger.info(`Trying to emit initial notification for user ${userId}`);
        RedisClient.getAll(`ntpnotif_${userId}_*`)
            .then((res) => {
                logger.info(
                    `Got notification data from client, ${res.length} total notification will be pushed!`
                );
                const sortedByTimestamp = _.sortBy(res, "ts").reverse();
                io.emit(`notificationpush-${userId}`, JSON.stringify(sortedByTimestamp));
                // io.to(`ntp${userId}`).emit("notificationpush", JSON.stringify(sortedByTimestamp));
            })
            .catch((e) => {
                logger.error(`An error occured while trying to send push notification, ${e.toString()}`);
            });

        socket.on("pollnotification", () => {
            logger.info("Received poll notification!");
            RedisClient.getAll(`ntpnotif_${userId}_*`)
                .then((res) => {
                    logger.info(
                        `Got notification data from client, ${res.length} total notification will be pushed!`
                    );
                    const sortedByTimestamp = _.sortBy(res, "ts").reverse();
                    io.emit(`notificationpush-${userId}`, JSON.stringify(sortedByTimestamp));
                    // io.to(`ntp${userId}`).emit("notificationpush", JSON.stringify(sortedByTimestamp));
                })
                .catch((e) => {
                    logger.error(`An error occured while trying to send push notification, ${e.toString()}`);
                });
        });
    });

    return io;
}
