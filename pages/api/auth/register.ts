import { toString } from "lodash";

import withSession from "@/lib/session";
import { isNone } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { emitSocketAndWait, updateShowtimesData } from "@/lib/socket";

function checkStringValid(data: any): boolean {
    if (typeof data !== "string") return false;
    if (data === "" || data === " ") return false;
    return true;
}

async function tryServerAdminAdd(adminId: string, serverId: string) {
    const existingUsers = await prisma.showtimesadmin.findFirst({ where: { id: adminId } });
    let existingId: string;
    if (!isNone(existingUsers)) {
        // eslint-disable-next-line no-underscore-dangle
        existingId = existingUsers.mongo_id;
    }
    if (isNone(existingId)) {
        await prisma.showtimesadmin.create({
            data: {
                id: adminId,
                servers: [serverId],
            },
        });
    } else {
        await prisma.showtimesadmin.update({
            where: {
                mongo_id: existingId,
            },
            data: {
                servers: {
                    push: serverId,
                },
            },
        });
    }
    await updateShowtimesData(adminId, "admin");
}

async function registerNewServer(server: any, admin: any) {
    const serverName = server.name;
    const serverId = server.id;

    const adminId = admin.id;

    await prisma.showtimesdatas.create({
        data: {
            id: toString(serverId),
            name: serverName,
            serverowner: [toString(adminId)],
            anime: [],
            announce_channel: null,
            konfirmasi: [],
        },
    });
    await tryServerAdminAdd(toString(adminId), toString(serverId));
    await updateShowtimesData(serverId);
}

export default withSession(async (req, res) => {
    const { server, admin } = await req.body;
    if (!checkStringValid(server)) {
        res.status(401).json({ error: "Mohon masukan server ID", success: false, code: 400 });
    } else if (!checkStringValid(admin)) {
        res.status(401).json({ error: "Mohon masukan Admin ID", success: false, code: 400 });
    } else {
        try {
            console.info("Finding love...");
            const checkIfServerExist = await prisma.showtimesdatas.findFirst({ where: { id: server } });
            if (!isNone(checkIfServerExist)) {
                console.warn("Already exist!");
                res.status(400).json({ error: "Server anda telah terdaftar!", success: false, code: 4104 });
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
                                code: 4103,
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
                                    try {
                                        await registerNewServer(verifyServer, verifyUser);
                                        res.json({ success: true });
                                    } catch (e) {
                                        console.error(e);
                                        res.status(500).json({
                                            error: "Maaf, terjadi kesalahan internal ketika ingin mendaftarkan anda, mohon kontak Admin",
                                            code: 500,
                                            success: false,
                                        });
                                    }
                                } else {
                                    res.status(403).json({
                                        error: "Maaf, anda tidak memiliki hak yang cukup untuk menjadi Admin (Manage Guild)",
                                        code: 4102,
                                        success: false,
                                    });
                                }
                            } catch (e) {
                                console.error(e);
                                res.status(500).json({
                                    error: "Terjadi kesalahan internal, mohon coba lagi nanti",
                                    code: 500,
                                    success: false,
                                });
                            }
                        }
                    } catch (e) {
                        res.status(400).json({
                            error: "Bot tidak dapat menemukan user tersebut!",
                            success: false,
                            code: 4101,
                        });
                    }
                } catch (e) {
                    res.status(400).json({
                        error: "Bot tidak dapat menemukan server tersebut! Pastikan Bot sudah di Invite!",
                        code: 4100,
                        success: false,
                    });
                }
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: "Terjadi kesalahan internal, mohon coba lagi!",
                code: 500,
                success: false,
            });
        }
    }
});
