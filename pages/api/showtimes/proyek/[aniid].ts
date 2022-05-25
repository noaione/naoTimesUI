import { NextApiResponse } from "next";

import dbConnect from "@/lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";

import { ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "@/models/show";
import { isNone, Nullable } from "@/lib/utils";

function selectFirst(target: string | string[]): string {
    if (Array.isArray(target)) {
        return target[0];
    }
    return target;
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
    const { aniid } = req.query;
    const singleAnimeId = selectFirst(aniid);
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
            const fetchServers = (await ShowtimesModel.findOne({
                id: { $eq: user.id },
            }).lean()) as ShowtimesProps;
            let findAnime: Nullable<ShowAnimeProps>;
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
