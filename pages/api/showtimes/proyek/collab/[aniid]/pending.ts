import { NextApiResponse } from "next";

import dbConnect from "@/lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import { isNone } from "@/lib/utils";

import { ShowtimesModel, ShowtimesProps } from "@/models/show";
import { KonfirmasiData } from "@/types/collab";

type KonfirmasiTanpaAnime = Omit<KonfirmasiData, "animeInfo">;

async function fetchAllPendingConfirmations(
    serverData: ShowtimesProps,
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
        let fetchedAnimeInfo: ShowtimesProps;
        try {
            fetchedAnimeInfo = await ShowtimesModel.findOne(
                {
                    id: konfirmasi.server_id,
                    "anime.id": konfirmasi.anime_id,
                },
                { id: 1, name: 1 }
            );
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

    await dbConnect();
    try {
        console.info("Fetching...");
        const fetchedServers = await ShowtimesModel.findOne(
            { id: { $eq: user.id }, "anime.id": aniid },
            { id: 1, name: 1, konfirmasi: 1 }
        );
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
