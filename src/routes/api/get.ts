import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import { isNone } from "../../lib/utils";
import { ShowtimesModel, ShowtimesProps } from "../../models/show";
import { UserProps } from "../../models/user";
import { get } from "lodash";

const APIGetRoutes = express.Router();

APIGetRoutes.get("/", ensureLoggedIn("/"), async (req, res) => {
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            const allResults = await ShowtimesModel.find({}, { _id: 0, konfirmasi: 0, "anime.status": 0 });
            res.json({ data: allResults, code: 200 });
        } else {
            const fetchServers = await ShowtimesModel.findOne(
                { id: { $eq: userData.id } },
                { _id: 0, konfirmasi: 0, serverowner: 0, "anime.status": 0 }
            );
            res.json({
                anime: fetchServers["anime"],
                id: fetchServers["id"],
                announce_channel: fetchServers["announce_channel"],
                code: 200,
            });
        }
    }
});

function filterToSpecificAnime(results: ShowtimesProps, anime_id: string) {
    const animeLists = results.anime.filter((res) => res.id === anime_id);
    return animeLists;
}

APIGetRoutes.get("/statuses/:anime_id", ensureLoggedIn("/"), async (req, res) => {
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            const allResults = await ShowtimesModel.find(
                {},
                {
                    id: 1,
                    serverowner: 1,
                    "anime.id": 1,
                    "anime.title": 1,
                    "anime.poster_data": 1,
                    "anime.status": 1,
                }
            );
            res.json({ data: allResults, code: 200 });
        } else {
            const fetchServers = await ShowtimesModel.findOne(
                { id: { $eq: userData.id } },
                {
                    "anime.id": 1,
                    "anime.title": 1,
                    "anime.poster_data": 1,
                    "anime.status": 1,
                }
            );
            res.json({
                data: get(filterToSpecificAnime(fetchServers, req.params.anime_id), "0", {}),
                code: 200,
            });
        }
    }
});

export { APIGetRoutes };
