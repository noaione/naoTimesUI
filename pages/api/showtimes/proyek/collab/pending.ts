import withSession, { getServerUser } from "@/lib/session";
import { isNone } from "@/lib/utils";

import { Confirmations } from "@/types/collab";
import prisma from "@/lib/prisma";
import { showtimesdatas } from "@prisma/client";

type ShowtimesCollabData = Pick<showtimesdatas, "id" | "name" | "konfirmasi">;

async function fetchAllCollabData(serverData: ShowtimesCollabData): Promise<Confirmations> {
    if (serverData.konfirmasi.length < 1) {
        return [];
    }

    const allCollabs: Confirmations = [];
    for (let i = 0; i < serverData.konfirmasi.length; i++) {
        const konfirmasi = serverData.konfirmasi[i];
        let fetchedAnimeInfo: Pick<showtimesdatas, "id" | "name" | "anime">;
        try {
            fetchedAnimeInfo = await prisma.showtimesdatas.findFirst({
                where: {
                    id: konfirmasi.server_id,
                },
                select: {
                    id: true,
                    anime: true,
                    name: true,
                },
            });
        } catch (e) {
            return;
        }

        if (isNone(fetchedAnimeInfo)) {
            return;
        }

        const findAnime = fetchedAnimeInfo.anime.find((anime) => anime.id === konfirmasi.anime_id);
        if (isNone(findAnime)) {
            return;
        }

        allCollabs.push({
            id: konfirmasi.id,
            animeInfo: findAnime,
            serverId: konfirmasi.server_id,
            serverName: fetchedAnimeInfo.name,
        });
    }
    return allCollabs;
}

export default withSession(async (req, res) => {
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

    try {
        const fetchedServers = await prisma.showtimesdatas.findFirst({
            where: {
                id: user.id,
            },
            select: {
                id: true,
                name: true,
                konfirmasi: true,
            },
        });
        const allCollabs = await fetchAllCollabData(fetchedServers);
        res.json({ data: allCollabs, success: true });
    } catch (e) {
        res.status(500).json({
            message: "Terjadi kesalahan ketika memproses request anda...",
            code: 500,
            success: false,
        });
    }
});
