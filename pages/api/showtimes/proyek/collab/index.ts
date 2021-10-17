import { NextApiResponse } from "next";

import dbConnect from "@/lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";

import { ShowtimesModel, ShowtimesProps } from "@/models/show";
import { Collaborations } from "@/types/collab";

async function fetchAllCollabData(serverData: ShowtimesProps): Promise<Collaborations> {
    const allCollabs: Collaborations = [];
    for (let i = 0; i < serverData.anime.length; i++) {
        const anime = serverData.anime[i];
        const filteredCollab = anime.kolaborasi.filter((p) => p !== serverData.id);
        if (filteredCollab.length < 1) {
            continue;
        }
        const allValidCollab = [];
        for (let jj = 0; jj < filteredCollab.length; jj++) {
            const collab = filteredCollab[jj];
            try {
                console.info(`Fetching ${collab} at ${anime.id}`);
                const requested = (await ShowtimesModel.findOne({ id: { $eq: collab } })) as ShowtimesProps;
                console.info(`Pushing ${collab} at ${anime.id}`);
                allValidCollab.push({
                    id: requested.id,
                    name: requested.name,
                });
                console.info(`Pushed ${collab} at ${anime.id}`);
            } catch (e) {
                continue;
            }
        }
        console.info("VALID", allValidCollab, anime.id);
        if (allValidCollab.length < 1) {
            continue;
        }
        // @ts-ignore
        const imgPoster = anime.poster_data.url;
        allCollabs.push({
            id: anime.id,
            title: anime.title,
            image: imgPoster,
            collaborations: allValidCollab,
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
            { id: 1, name: 1, anime: 1 }
        );
        const allCollabs = await fetchAllCollabData(fetchedServers);
        res.json({ data: allCollabs, success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Terjadi kesalahan ketika memproses request anda...",
            code: 500,
            success: false,
        });
    }
});
