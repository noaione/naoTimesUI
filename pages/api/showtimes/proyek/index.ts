import withSession, { getServerUser } from "@/lib/session";
import { isNone, Nullable } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { Project, ProjectEpisodeStatus } from "@prisma/client";

type ProjectPick = Pick<Project, "id" | "title" | "assignments" | "poster_data" | "start_time" | "status">;
interface ProjectGet {
    anime: ProjectPick[];
}

function projectOverviewKeyFilter(fetchedData: ProjectGet) {
    const animeSets = [];
    fetchedData.anime.forEach((anime_data) => {
        let latestEpisode: Nullable<ProjectEpisodeStatus>;
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

export default withSession(async (req, res) => {
    const user = getServerUser(req);
    if (!user) {
        res.status(403).json({ success: false, message: "Unauthorized", code: 403 });
    } else {
        if (user.privilege === "owner") {
            res.status(501).json({
                success: false,
                message: "Sorry, this API routes is not implemented",
                code: 501,
            });
        } else {
            const fetchedData = await prisma.showtimesdatas.findFirst({
                where: { id: user.id },
                select: {
                    anime: {
                        select: {
                            id: true,
                            title: true,
                            assignments: true,
                            poster_data: true,
                            start_time: true,
                            status: true,
                        },
                    },
                },
            });
            res.json({
                message: "Sukses",
                data: projectOverviewKeyFilter(fetchedData),
                code: 200,
                success: true,
            });
        }
    }
});
