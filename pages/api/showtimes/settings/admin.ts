import { NextApiResponse } from "next";

import { emitSocket } from "@/lib/socket";
import { isNone } from "@/lib/utils";
import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import prisma from "@/lib/prisma";

async function tryToAdjustAdminData(serverId: string, newAdminIds: string[]): Promise<[string, boolean]> {
    if (!Array.isArray(newAdminIds)) {
        return ["Mohon berikan array of string untuk adminIds", false];
    }
    newAdminIds = newAdminIds.filter((e) => typeof e === "string" && e.length > 0);
    if (newAdminIds.length < 1) {
        return ["Admin IDs kosong, mohon isi dengan Discord ID", false];
    }
    let successCheck1 = true;
    let failed = "";
    newAdminIds.forEach((admin) => {
        if (Number.isNaN(parseInt(admin))) {
            successCheck1 = false;
            failed = admin;
        }
    });
    if (!successCheck1) {
        return [`Salah satu admin ID bukanlah angka: ${failed}`, false];
    }
    let successCheck2 = false;
    try {
        const showAdmin = await prisma.showtimesadmin.findMany();
        const serversAdminsSets: string[] = [];
        showAdmin.forEach((res) => {
            if (res.servers.includes(serverId)) {
                serversAdminsSets.push(res.id);
            }
        });
        serversAdminsSets.forEach((admin) => {
            if (newAdminIds.includes(admin)) {
                successCheck2 = true;
            }
        });
    } catch (e) {
        console.error(e);
        return ["Gagal mengambil database, mohon coba lagi nanti", false];
    }
    if (!successCheck2) {
        return ["Tidak dapat menemukan Server Admin utama dalam list baru, mohon cek lagi", false];
    }
    try {
        const serverInfo = await prisma.showtimesdatas.findFirst({
            where: { id: serverId },
            select: { id: true, mongo_id: true },
        });
        if (isNone(serverInfo)) {
            return ["Gagal memperbarui database, mohon coba lagi nanti", false];
        }
        await prisma.showtimesdatas.update({
            where: { mongo_id: serverInfo.mongo_id },
            data: {
                serverowner: {
                    set: newAdminIds,
                },
            },
        });
    } catch (e) {
        return ["Gagal memperbarui database, mohon coba lagi nanti", false];
    }
    emitSocket("pull data", serverId);
    return ["sukses", true];
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const reqData = await req.body;
    const user = req.session.get<IUserAuth>("user");
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else if (!reqData) {
        res.status(400).json({ message: "Tidak ada body yang diberikan :(", code: 400 });
    } else if (isNone(reqData.adminIds)) {
        res.status(400).json({ message: "Mohon berikan adminIds untuk perubahan baru", code: 400 });
    } else {
        if (user.privilege === "owner") {
            res.status(501).json({
                message: "Sorry, this API routes is not implemented",
                code: 501,
            });
        } else {
            const [msg, status] = await tryToAdjustAdminData(user.id, reqData.adminIds);
            if (!status) {
                res.status(500).json({ message: msg, code: 500 });
            } else {
                res.json({ message: msg, code: 200 });
            }
        }
    }
});
