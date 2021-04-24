import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../../lib/dbConnect";
import withSession from "../../../lib/session";
import { isNone, Nullable } from "../../../lib/utils";

import { ShowtimesModel, ShowtimesProps } from "../../../models/show";
import { UserProps } from "../../../models/user";

interface SessionClass {
    get<T extends any>(key: string): Nullable<T>;
}

function projectOverviewKeyFilter(fetchedData: ShowtimesProps) {
    const animeSets = [];
    fetchedData.anime.forEach((anime_data) => {
        let latestEpisode;
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
        let isFinished = false;
        if (isNone(latestEpisode)) {
            isFinished = true;
        }
        const newData = {
            id: anime_data.id,
            title: anime_data.title,
            assignments: anime_data.assignments,
            poster: anime_data.poster_data.url,
            is_finished: isFinished,
        };
        animeSets.push(newData);
    });
    return animeSets;
}

export default withSession(async (req: NextApiRequest & { session: SessionClass }, res: NextApiResponse) => {
    const user = req.session.get<UserProps>("user");
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
                    "anime.status": 1,
                }
            );
            res.json({ data: projectOverviewKeyFilter(fetchServers), code: 200 });
        }
    }
});
