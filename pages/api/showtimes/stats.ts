import { NextApiResponse } from "next";

import dbConnect from "../../../lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../lib/session";

import { ShowtimesModel, ShowtimesProps } from "../../../models/show";

function countAdminStats(servers_data: ShowtimesProps[]) {
    let adminCount = 0;
    const savedAdmin = [];
    servers_data.forEach((server) => {
        server.serverowner.forEach((res) => {
            if (!savedAdmin.includes(res)) {
                savedAdmin.push(res);
                adminCount++;
            }
        });
    });
    return adminCount;
}

function countAnimeStats(servers_data: ShowtimesProps[]) {
    let animeCount = 0;
    let rawProjectCount = 0;
    const savedAnime = [];
    servers_data.forEach((server) => {
        server.anime.forEach((res) => {
            if (!savedAnime.includes(res.id)) {
                savedAnime.push(res.id);
                animeCount++;
            }
            rawProjectCount++;
        });
    });
    return [animeCount, rawProjectCount];
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        await dbConnect();
        if (user.privilege === "owner") {
            const fetchServers = await ShowtimesModel.find(
                {},
                {
                    serverowner: 1,
                    "anime.id": 1,
                }
            );
            const totalServers = fetchServers.length;
            const [totalAnime, rawProjectCount] = countAnimeStats(fetchServers);
            const totalAdmin = countAdminStats(fetchServers);
            res.json({
                code: 200,
                data: [
                    {
                        key: "server",
                        data: totalServers,
                    },
                    {
                        key: "anime",
                        data: totalAnime,
                    },
                    {
                        key: "admin",
                        data: totalAdmin,
                    },
                    {
                        key: "proyek",
                        data: rawProjectCount,
                    },
                ],
            });
        } else {
            const fetchServers = await ShowtimesModel.findOne(
                { id: { $eq: user.id } },
                {
                    "anime.status": 1,
                }
            );
            const statsData = { finished: 0, unfinished: 0 };
            fetchServers.anime.forEach((anime) => {
                let anyUndone = false;
                anime.status.forEach((statusRes) => {
                    if (!statusRes.is_done) {
                        anyUndone = true;
                    }
                });
                if (anyUndone) {
                    statsData.unfinished++;
                } else {
                    statsData.finished++;
                }
            });
            res.json({
                code: 200,
                data: [
                    {
                        key: "ongoing",
                        data: statsData.unfinished,
                    },
                    {
                        key: "done",
                        data: statsData.finished,
                    },
                ],
            });
        }
    }
});
