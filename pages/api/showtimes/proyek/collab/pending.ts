import { NextApiResponse } from "next";

import dbConnect from "@/lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import { isNone } from "@/lib/utils";

import { ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "@/models/show";
import { Confirmations } from "@/types/collab";

async function fetchAllCollabData(serverData: ShowtimesProps): Promise<Confirmations> {
    if (serverData.konfirmasi.length < 1) {
        return [];
    }

    const allCollabs: Confirmations = [];
    for (let i = 0; i < serverData.konfirmasi.length; i++) {
        const konfirmasi = serverData.konfirmasi[i];
        let fetchedAnimeInfo: ShowtimesProps;
        try {
            fetchedAnimeInfo = await ShowtimesModel.findOne(
                {
                    id: konfirmasi.server_id,
                    "anime.id": konfirmasi.anime_id,
                },
                { id: 1, anime: 1, name: 1 }
            );
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
            animeInfo: findAnime as ShowAnimeProps,
            serverId: konfirmasi.server_id,
            serverName: fetchedAnimeInfo.name,
        });
    }
    return allCollabs;
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

    await dbConnect();
    try {
        const fetchedServers = await ShowtimesModel.findOne(
            { id: { $eq: user.id } },
            { id: 1, name: 1, konfirmasi: 1 }
        );
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
