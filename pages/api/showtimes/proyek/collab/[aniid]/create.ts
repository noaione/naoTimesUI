import withSession, { getServerUser, NextApiRequestWithSession } from "@/lib/session";
import { NextApiResponse } from "next";

import { emitSocketAndWait } from "@/lib/socket";
import prisma from "@/lib/prisma";

interface KonfirmAPIData {
    targetId: string;
}

interface KonfirmasiData {
    animeId: string;
    // Source server
    serverId: string;
    // Target server
    targetId: string;
}

function generateRandomStringAndNumber(length: number) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

async function createNewCollab(collabData: KonfirmasiData) {
    const { animeId, serverId, targetId } = collabData;

    const fetchedServer = await prisma.showtimesdatas.findFirst({
        where: {
            id: targetId,
        },
        select: {
            id: true,
            name: true,
            konfirmasi: true,
            anime: {
                select: {
                    id: true,
                    kolaborasi: true,
                },
            },
            mongo_id: true,
        },
    });
    const randomId = generateRandomStringAndNumber(16);
    const indexedAnime = fetchedServer.anime.findIndex((pog) => pog.id === animeId);
    if (indexedAnime !== -1) {
        const theAnime = fetchedServer.anime[indexedAnime];
        const findKonfirm = theAnime.kolaborasi.findIndex((champ) => champ === serverId);
        if (findKonfirm !== -1) {
            return [false, "Peladen sudah diajak kolaborasi!"];
        }
    }

    const newContent = {
        id: randomId,
        anime_id: animeId,
        server_id: serverId,
    };

    let konfirmData = fetchedServer.konfirmasi;
    if (!Array.isArray(konfirmData)) {
        konfirmData = [];
    }
    const indexed = konfirmData.findIndex((e) => e.anime_id === animeId);
    if (indexed !== -1) {
        const indexData = konfirmData[indexed];
        return [false, `Kode sudah ada, mohon berikan kode berikut: ${indexData.id}`];
    }
    await prisma.showtimesdatas.update({
        where: { mongo_id: fetchedServer.mongo_id },
        data: {
            konfirmasi: {
                push: newContent,
            },
        },
    });
    await emitSocketAndWait("pull data", targetId);
    return [
        true,
        {
            id: randomId,
            animeId: animeId,
            serverId: serverId,
            targetServerId: targetId,
        },
    ];
}

function selectFirst(target: string | string[]): string {
    if (Array.isArray(target)) {
        return target[0];
    }
    return target;
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
    const bodyBag = (await req.body) as KonfirmAPIData;
    if (typeof bodyBag.targetId !== "string") {
        return res.status(400).json({ message: "Invalid data", code: 400 });
    }
    const serverTarget = bodyBag.targetId;

    try {
        const [boolRes, result] = await createNewCollab({
            serverId: user.id,
            animeId: selectFirst(aniid),
            targetId: serverTarget,
        });
        if (boolRes) {
            res.json({ data: result, code: 200, success: true });
        } else {
            res.status(500).json({ data: {}, code: 500, success: false, message: result });
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
