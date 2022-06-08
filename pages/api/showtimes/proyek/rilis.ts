import prisma from "@/lib/prisma";
import _ from "lodash";
import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import { emitSocket } from "@/lib/socket";
import { isNone, mapBoolean, verifyExist } from "@/lib/utils";

function verifyContents(data: any) {
    return (
        verifyExist(data, "anime_id", "string") &&
        verifyExist(data, "episode", "number") &&
        verifyExist(data, "is_done", "boolean")
    );
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const jsonBody = await req.body;
    const userData = req.session.get<IUserAuth>("user");
    if (isNone(jsonBody) || Object.keys(jsonBody).length < 1) {
        return res
            .status(400)
            .json({ success: false, message: "Tidak dapat menemukan body di request", code: 400 });
    }
    if (!verifyContents(jsonBody)) {
        return res.status(400).json({ success: false, message: "Terdapat data yang kurang!", code: 400 });
    }
    if (isNone(userData)) {
        res.status(403).json({
            success: false,
            message: "Tidak diperbolehkan untuk mengakses API ini",
            code: 403,
        });
    } else {
        if (userData.privilege === "owner") {
            res.status(501).json({
                success: false,
                message: "Sorry, this API routes is not implemented",
                code: 501,
            });
        } else {
            const serverData = await prisma.showtimesdatas.findFirst({
                where: {
                    id: userData.id,
                },
            });
            if (isNone(serverData)) {
                res.status(500).json({
                    success: false,
                    message: "Tidak dapat menemukan server yang diberikan",
                    code: 4501,
                });
            } else {
                const { anime_id, episode, is_done } = jsonBody;
                const indexAnime = _.findIndex(serverData.anime, (pred) => pred.id === anime_id);
                if (indexAnime === -1) {
                    res.status(400).json({
                        success: false,
                        message: "Tidak dapat menemukan anime yang diberikan",
                        code: 4301,
                    });
                } else {
                    const project = serverData.anime[indexAnime];
                    const episodeIndex = _.findIndex(
                        project.status,
                        (pred) => pred.episode === parseInt(episode)
                    );
                    if (episodeIndex === -1) {
                        return res.status(400).json({
                            success: false,
                            message: "Episode tidak dapat ditemukan!",
                            code: 4304,
                        });
                    }
                    await prisma.showtimesdatas.update({
                        where: { mongo_id: serverData.mongo_id },
                        data: {
                            anime: {
                                updateMany: {
                                    where: { id: anime_id },
                                    data: {
                                        status: {
                                            updateMany: {
                                                where: {
                                                    episode: parseInt(episode),
                                                },
                                                data: {
                                                    is_done: mapBoolean(is_done),
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                    emitSocket("pull data", userData.id);
                    res.json({ success: true, message: "Berhasil mengubah status episode", code: 200 });
                }
            }
        }
    }
});
