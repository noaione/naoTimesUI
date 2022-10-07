import withSession, { getServerUser } from "@/lib/session";
import { Project, showtimesdatas } from "@prisma/client";
import prisma from "@/lib/prisma";

// serverowner: string[];
// anime: {
//     id: string;
// }[];
type ServerOwnerPick = Pick<showtimesdatas, "serverowner">;
type AnimePick = Pick<Project, "id">;
type ServerPick = ServerOwnerPick & { anime: AnimePick[] };

function countAdminStats(servers_data: ServerPick[]) {
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

function countAnimeStats(servers_data: ServerPick[]) {
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

export default withSession(async (req, res) => {
    const user = getServerUser(req);
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        if (user.privilege === "owner") {
            const fetchServers = await prisma.showtimesdatas.findMany({
                select: {
                    serverowner: true,
                    anime: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
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
            const fetchServers = await prisma.showtimesdatas.findFirst({
                where: {
                    id: user.id,
                },
                select: {
                    anime: {
                        select: {
                            status: true,
                        },
                    },
                },
            });
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
