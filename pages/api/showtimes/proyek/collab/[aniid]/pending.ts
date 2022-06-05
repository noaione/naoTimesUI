import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import { isNone } from "@/lib/utils";

import { KonfirmasiData } from "@/types/collab";
import prisma from "@/lib/prisma";
import { showtimesdatas } from "@prisma/client";

type KonfirmasiTanpaAnime = Omit<KonfirmasiData, "animeInfo">;

type ServerKonfirmasi = Pick<showtimesdatas, "id" | "name" | "konfirmasi" | "mongo_id">;

async function fetchAllPendingConfirmations(
    serverData: ServerKonfirmasi,
    animeId: string
): Promise<KonfirmasiTanpaAnime[]> {
    if (serverData.konfirmasi.length < 1) {
        return [];
    }

    const konfirmasiData: KonfirmasiTanpaAnime[] = [];
    for (let i = 0; i < serverData.konfirmasi.length; i++) {
        const konfirmasi = serverData.konfirmasi[i];
        if (konfirmasi.anime_id !== animeId) {
            continue;
        }
        let fetchedAnimeInfo: Pick<showtimesdatas, "id" | "name" | "mongo_id">;
        try {
            fetchedAnimeInfo = await prisma.showtimesdatas.findFirst({
                where: { id: konfirmasi.server_id },
                select: { id: true, name: true, mongo_id: true },
            });
        } catch (e) {
            continue;
        }

        if (isNone(fetchedAnimeInfo)) {
            continue;
        }

        konfirmasiData.push({
            id: konfirmasi.id,
            serverId: konfirmasi.server_id,
            serverName: fetchedAnimeInfo.name,
        });
    }
    return konfirmasiData;
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
    if (!user) {
        return res.status(403).json({ message: "Unauthorized", code: 403 });
    }

    if (user.privilege === "owner") {
        return res.status(501).json({
            message: "Sorry, this API routes is not implemented",
            code: 501,
        });
    }

    const { aniid } = req.query;

    let realAnimeId = aniid as string;
    if (Array.isArray(aniid)) {
        realAnimeId = aniid[0];
    }

    try {
        console.info("Fetching...");
        const fetchedServers = await prisma.showtimesdatas.findFirst({
            where: { id: user.id },
            select: {
                konfirmasi: true,
                id: true,
                mongo_id: true,
                name: true,
            },
        });
        const allPendings = await fetchAllPendingConfirmations(fetchedServers, realAnimeId);
        res.json({ data: allPendings, success: true });
    } catch (e) {
        res.status(500).json({
            message: "Terjadi kesalahan ketika memproses request anda...",
            code: 500,
            success: false,
        });
    }
});
