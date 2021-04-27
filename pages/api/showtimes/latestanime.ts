import { NextApiResponse } from "next";

import dbConnect from "../../../lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../lib/session";
import { isNone, Nullable } from "../../../lib/utils";

import { ShowtimesModel, ShowtimesProps } from "../../../models/show";

function filterToNewestStatusOnly(fetchedData: ShowtimesProps) {
    const animeSets = [];
    fetchedData.anime.forEach((anime_data) => {
        let latestEpisode: Nullable<any>;
        for (let ep = 0; ep < anime_data.status.length; ep++) {
            const status_ep = anime_data.status[ep];
            if (status_ep.is_done) {
                continue;
            }
            if (isNone(latestEpisode)) {
                latestEpisode = status_ep;
                break;
            }
        }
        if (isNone(latestEpisode)) {
            return;
        }
        const newData = {
            id: anime_data.id,
            title: anime_data.title,
            start_time: anime_data.start_time,
            assignments: anime_data.assignments,
            poster: anime_data.poster_data.url,
            status: latestEpisode,
        };
        animeSets.push(newData);
    });
    return animeSets;
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        await dbConnect();
        if (user.privilege === "owner") {
            res.status(501).json({
                message: "Sorry, this API routes is not implemented",
                code: 501,
            });
        } else {
            const fetchServers = await ShowtimesModel.findOne(
                { id: { $eq: user.id } },
                {
                    "anime.id": 1,
                    "anime.title": 1,
                    "anime.assignments": 1,
                    "anime.poster_data": 1,
                    "anime.start_time": 1,
                    "anime.status": 1,
                }
            );
            res.json({ data: filterToNewestStatusOnly(fetchServers), code: 200 });
        }
    }
});
