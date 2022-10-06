import { NextApiResponse } from "next";

import withSession, { getServerUser, NextApiRequestWithSession } from "@/lib/session";
import { isNone, Nullable } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { Project } from "@prisma/client";

function selectFirst(target: string | string[]): string {
    if (Array.isArray(target)) {
        return target[0];
    }
    return target;
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = getServerUser(req);
    const { aniid } = req.query;
    const singleAnimeId = selectFirst(aniid);
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        if (user.privilege === "owner") {
            res.status(501).json({
                message: "Sorry, this API routes is not implemented",
                code: 501,
            });
        } else {
            const fetchServers = await prisma.showtimesdatas.findFirst({
                where: {
                    id: user.id,
                },
            });
            let findAnime: Nullable<Project>;
            // loop till find the anime
            for (let i = 0; i < fetchServers.anime.length; i++) {
                if (fetchServers.anime[i].id === singleAnimeId) {
                    findAnime = fetchServers.anime[i];
                    break;
                }
            }

            if (isNone(findAnime)) {
                res.status(404).json({
                    message: "Anime not found",
                    code: 404,
                    success: false,
                    data: null,
                });
            } else {
                res.status(200).json({
                    message: "Success",
                    code: 200,
                    success: true,
                    data: findAnime,
                });
            }
        }
    }
});
