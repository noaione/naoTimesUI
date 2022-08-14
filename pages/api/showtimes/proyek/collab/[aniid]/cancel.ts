import withSession, { getServerUser, IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import { NextApiResponse } from "next";

import { emitSocketAndWait } from "@/lib/socket";
import prisma from "@/lib/prisma";
import { showtimesdatas } from "@prisma/client";
import { isNone } from "@/lib/utils";

async function removeConfirmationCode(
    serverData: Pick<showtimesdatas, "id" | "name" | "konfirmasi" | "mongo_id">,
    animeId: string
): Promise<boolean> {
    if (serverData.konfirmasi.length < 1) {
        return false;
    }

    const leftOver = serverData.konfirmasi.filter((o) => o.anime_id !== animeId);
    await prisma.showtimesdatas.update({
        where: {
            mongo_id: serverData.mongo_id,
        },
        data: {
            konfirmasi: leftOver,
        },
    });
    await emitSocketAndWait("pull data", serverData.id);
    return true;
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    if (req.method?.toLowerCase() !== "post") {
        return res.status(405).json({ message: "Method not allowed", code: 405 });
    }
    const user = getServerUser(req);
    if (!user) {
        return res.status(403).json({ message: "Unauthorized", code: 403 });
    }

    if (user.privilege === "owner") {
        return res.status(501).json({
            message: "Sorry, this API routes is not implemented",
            code: 501,
        });
    }

    // remove from existence!
    const { aniid } = req.query;

    try {
        const fetchedServers = await prisma.showtimesdatas.findFirst({
            where: {
                id: user.id,
            },
            select: {
                id: true,
                name: true,
                konfirmasi: true,
                mongo_id: true,
            },
        });
        if (isNone(fetchedServers)) {
            res.status(500).json({
                success: false,
                code: 4501,
                message: "Tidak dapat menemukan server anda!",
            });
        } else {
            const success = await removeConfirmationCode(fetchedServers, aniid as string);
            if (success) {
                res.json({ success: true, code: 200 });
            } else {
                res.status(500).json({
                    success: true,
                    code: 500,
                    message: "Terjadi kesalahan ketika menghubungi database, mohon coba lagi nanti!",
                });
            }
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Terjadi kesalahan ketika memproses request anda...",
            code: 500,
            success: false,
        });
    }
});
