import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import { filterToSpecificAnime, isNone } from "../../lib/utils";
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

function filterToNewestStatusOnly(fetchedData: ShowtimesProps) {
    const animeSets = [];
    fetchedData.anime.forEach((anime_data) => {
        const newData = {};
        newData["id"] = anime_data.id;
        newData["title"] = anime_data.title;
        newData["start_time"] = anime_data.start_time;
        newData["assignments"] = anime_data.assignments;
        newData["poster"] = anime_data.poster_data.url;
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
        if (isNone(latestEpisode)) {
            return;
        }
        newData["status"] = latestEpisode;
        animeSets.push(newData);
    });
    return animeSets;
}

function projectOverviewKeyFilter(fetchedData: ShowtimesProps) {
    const animeSets = [];
    fetchedData.anime.forEach((anime_data) => {
        const newData = {};
        newData["id"] = anime_data.id;
        newData["title"] = anime_data.title;
        newData["assignments"] = anime_data.assignments;
        newData["poster"] = anime_data.poster_data.url;
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
        if (isNone(latestEpisode)) {
            newData["is_finished"] = true;
        } else {
            newData["is_finished"] = false;
        }
        animeSets.push(newData);
    });
    return animeSets;
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

APIGetRoutes.get("/stats", ensureLoggedIn("/"), async (req, res) => {
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
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
                data: {
                    servers: totalServers,
                    anime: totalAnime,
                    admins: totalAdmin,
                    project: rawProjectCount,
                },
            });
        } else {
            const fetchServers = await ShowtimesModel.findOne(
                { id: { $eq: userData.id } },
                {
                    "anime.status": 1,
                }
            );
            const statsData = { finished: 0, unfinished: 0 };
            fetchServers.anime.forEach((anime) => {
                let anyUndone = false;
                anime.status.forEach((res) => {
                    if (!res.is_done) {
                        anyUndone = true;
                    }
                });
                if (anyUndone) {
                    statsData["unfinished"]++;
                } else {
                    statsData["finished"]++;
                }
            });
            res.json({ data: statsData, code: 200 });
        }
    }
});

APIGetRoutes.get("/projek", ensureLoggedIn("/"), async (req, res) => {
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            res.status(501).json({
                message: "Sorry, this API routes only available to non-admin account",
                code: 501,
            });
        } else {
            const fetchServers = await ShowtimesModel.findOne(
                { id: { $eq: userData.id } },
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

APIGetRoutes.get("/latestanime", ensureLoggedIn("/"), async (req, res) => {
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            res.status(501).json({
                message: "Sorry, this API routes only available to non-admin account",
                code: 501,
            });
        } else {
            const fetchServers = await ShowtimesModel.findOne(
                { id: { $eq: userData.id } },
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
