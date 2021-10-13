import { toString } from "lodash";
import { NextApiResponse } from "next";
import { Types } from "mongoose";

import dbConnect from "../../../lib/dbConnect";
import withSession, { NextApiRequestWithSession } from "../../../lib/session";
import { isNone, Nullable } from "../../../lib/utils";
import { emitSocket, emitSocketAndWait } from "../../../lib/socket";

import { ShowAdminModel, ShowtimesModel, ShowtimesProps } from "../../../models/show";

function checkStringValid(data: any): boolean {
    if (typeof data !== "string") return false;
    if (data === "" || data === " ") return false;
    return true;
}

async function tryServerAdminAdd(adminId: string, serverId: string) {
    const existingUsers = await ShowAdminModel.find({ id: { $eq: adminId } });
    let existingId: Nullable<Types.ObjectId>;
    if (existingUsers.length > 0) {
        // eslint-disable-next-line no-underscore-dangle
        existingId = existingUsers[0]._id;
    }
    if (isNone(existingId)) {
        const newSuperAdmin = {
            _id: new Types.ObjectId(),
            id: adminId,
            servers: [serverId],
        };
        await ShowAdminModel.insertMany([newSuperAdmin]);
    } else {
        // @ts-ignore
        await ShowAdminModel.findByIdAndUpdate(existingId, { $addToSet: { servers: serverId } });
    }
    emitSocket("pull admin", adminId);
}

async function registerNewServer(server: any, admin: any) {
    const serverName = server.name;
    const serverId = server.id;

    const adminId = admin.id;

    const newShowtimesServer: ShowtimesProps = {
        id: toString(serverId),
        name: serverName,
        serverowner: [toString(adminId)],
        anime: [],
        announce_channel: null,
        konfirmasi: [],
    };
    // @ts-ignore
    await ShowtimesModel.insertMany([newShowtimesServer]);
    await tryServerAdminAdd(toString(adminId), toString(serverId));
    emitSocket("pull data", serverId);
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const { server, admin } = await req.body;
    if (!checkStringValid(server)) {
        res.status(401).json({ error: "Mohon masukan server ID", success: false });
    } else if (!checkStringValid(admin)) {
        res.status(401).json({ error: "Mohon masukan Admin ID", success: false });
    } else {
        try {
            console.info("Trying to connect...");
            await dbConnect();
            console.info("Finding love...");
            const checkIfServerExist = await ShowtimesModel.find({ id: { $eq: server } });
            if (checkIfServerExist.length > 0) {
                console.warn("Already exist!");
                res.status(400).json({ error: "Server anda telah terdaftar!", success: false });
            } else {
                try {
                    console.info("Emitting server info...");
                    const verifyServer = await emitSocketAndWait("get server", server);
                    try {
                        console.info("Emitting user info...");
                        const verifyUser = await emitSocketAndWait("get user", admin);
                        if (verifyUser.is_bot) {
                            res.status(400).json({
                                error: "User adalah bot, bot tidak bisa menjadi Admin",
                                success: false,
                            });
                        } else {
                            try {
                                console.info("Emitting user perms...");
                                const userPerms = (await emitSocketAndWait("get user perms", {
                                    id: server,
                                    admin,
                                })) as string[];
                                console.info(userPerms);
                                if (
                                    userPerms.includes("owner") ||
                                    userPerms.includes("manage_guild") ||
                                    userPerms.includes("manage_server") ||
                                    userPerms.includes("administrator")
                                ) {
                                    console.info("Registering new server...");
                                    await registerNewServer(verifyServer, verifyUser);
                                    res.json({ success: true });
                                } else {
                                    res.status(403).json({
                                        error: "Maaf, anda tidak memiliki hak yang cukup untuk menjadi Admin (Manage Guild)",
                                        success: false,
                                    });
                                }
                            } catch (e) {
                                console.error(e);
                                res.status(500).json({
                                    error: "Terjadi kesalahan internal, mohon coba lagi nanti",
                                    success: false,
                                });
                            }
                        }
                    } catch (e) {
                        res.status(400).json({
                            error: "Bot tidak dapat menemukan user tersebut!",
                            success: false,
                        });
                    }
                } catch (e) {
                    res.status(400).json({
                        error: "Bot tidak dapat menemukan server tersebut! Pastikan Bot sudah di Invite!",
                        success: false,
                    });
                }
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Terjadi kesalahan internal, mohon coba lagi!", success: false });
        }
    }
});
