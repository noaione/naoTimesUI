import { ensureLoggedIn } from "connect-ensure-login";
import express from "express";
import { get, has } from "lodash";
import moment from "moment-timezone";

import { determineSeason, filterToSpecificAnime, isNone, Nullable, seasonNaming } from "../../lib/utils";
import { ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "../../models/show";
import { UserProps } from "../../models/user";

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

interface IResultOldDataset {
    id: string;
    title: string;
    episode: string | number;
    airing_time: number;
    staff: {
        TL: string;
        TLC: string;
        Encode: string;
        Edit: string;
        TS: string;
        Timing: string;
        QC: string;
    };
    status: {
        TL: boolean;
        TLC: boolean;
        Encode: boolean;
        Edit: boolean;
        TS: boolean;
        Timing: boolean;
        QC: boolean;
    };
}

interface IResultsOldStyles {
    data: IResultOldDataset[];
    name: string;
    total_data: number;
}

interface IResultOldSeasonKey {
    [season: string]: IResultsOldStyles;
}

function keyNamingRole(key: string) {
    switch (key) {
        case "ED":
            return "Edit";
        case "TM":
            return "Timing";
        case "ENC":
            return "Encode";
        default:
            return key;
    }
}

function parseStatusOldStyles(animeData: ShowAnimeProps[]): IResultOldSeasonKey {
    const seasonKeys: IResultOldSeasonKey = {};
    animeData.forEach((anime) => {
        let fetched = false;
        anime.status.forEach((status) => {
            if (!status.is_done && !fetched) {
                fetched = true;
                const mm = moment.utc(status.airtime * 1000);
                // @ts-ignore
                const seasonNo: 0 | 1 | 2 | 3 = determineSeason(mm.month());
                const year = mm.year();
                const ySeason = `${year}_${seasonNo}`;
                if (!has(seasonKeys, ySeason)) {
                    seasonKeys[ySeason] = {
                        data: [],
                        name: `${seasonNaming(seasonNo)} ${year}`,
                        total_data: 0,
                    };
                }
                const newStatus = {};
                for (const [key, val] of Object.entries(status.progress)) {
                    newStatus[keyNamingRole(key)] = val;
                }
                const staffAssigned = {};
                for (const [staff, staffData] of Object.entries(anime.assignments)) {
                    staffAssigned[keyNamingRole(staff)] = staffData.name || "Tidak diketahui";
                }
                const dataToAdd: IResultOldDataset = {
                    id: anime.id,
                    title: anime.title,
                    episode: status.episode.toString(),
                    airing_time: status.airtime,
                    // @ts-ignore
                    status: newStatus,
                    // @ts-ignore
                    staff: staffAssigned,
                };
                seasonKeys[ySeason]["data"].push(dataToAdd);
                seasonKeys[ySeason]["total_data"]++;
            }
        });
    });
    return seasonKeys;
}

// Fallback for old utang.naoti.me URL.
APIGetRoutes.get("/status/:server_id", async (req, res) => {
    const server_id = req.params.server_id;
    try {
        let animeSets: Nullable<ShowAnimeProps>;
        try {
            const serverRes = await ShowtimesModel.findOne({ id: { $eq: server_id } });
            // @ts-ignore
            animeSets = serverRes.anime;
            if (isNone(animeSets)) {
                res.status(404).json({ message: "Cannot find that server", status_code: 404 });
            } else {
                // @ts-ignore
                const results = parseStatusOldStyles(animeSets);
                res.json(results);
            }
        } catch (e) {
            res.status(404).json({ message: "Cannot find that server", status_code: 404 });
        }
        if (isNone(animeSets)) {
            res.status(404).json({ message: "Cannot find that server", status_code: 404 });
        } else {
            // parse
        }
    } catch (e) {
        res.status(500).json({ message: `An error occured, ${e.toString()}`, status_code: 500 });
    }
});

export { APIGetRoutes };
