import axios from "axios";
import { ensureLoggedIn } from "connect-ensure-login";
import express from "express";
import { get, has } from "lodash";

import { logger as MainLogger } from "../../lib/logger";
import { emitSocket, emitSocketAndWait } from "../../lib/socket";
import { isNone, Nullable, parseAnilistAPIResult, verifyExist } from "../../lib/utils";
import { ShowtimesModel } from "../../models/show";
import { UserProps } from "../../models/user";

const APIPOSTRoutes = express.Router();

const AnimeInfoQuery = `
query ($id:Int!) {
    Media(id:$id,type:ANIME) {
        id
        idMal
        title {
            romaji
            english
            native
        }
        coverImage {
            large
            medium
            color
        }
        format
        episodes
        startDate {
            year
            month
            day
        }
        airingSchedule {
            nodes {
                id
                episode
                airingAt
            }
        }
    }
}
`;

async function getAnimeInfo(animeId: string | number): Promise<any> {
    let parsedAniId: Nullable<number>;
    if (typeof animeId !== "number") {
        parsedAniId = parseInt(animeId);
        if (Number.isNaN(parsedAniId)) return {};
    }
    const req = await axios.post(
        "https://graphql.anilist.co",
        { query: AnimeInfoQuery, variables: { id: animeId } },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            responseType: "json",
        }
    );
    const res = req.data;
    return get(res, "data.Media", {});
}

APIPOSTRoutes.post("/serverinfo", ensureLoggedIn("/"), async (req, res) => {
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            res.status(504).json({ message: "Not implemented for Admin", code: 504 });
        } else {
            const results = await emitSocketAndWait("get server", userData.id);
            res.json({ data: results, code: 200 });
        }
    }
});

APIPOSTRoutes.post("/poll", ensureLoggedIn("/"), (req, res) => {
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            res.json({ done: false });
        } else {
            emitSocket("pull data", userData.id);
            res.json({ done: true });
        }
    }
});

async function addNewProject(dataToAdd: any) {
    if (!verifyExist(dataToAdd, "server", "string")) {
        return { success: false, message: "missing server key on request, or server key is not a string" };
    }
    if (!verifyExist(dataToAdd, "roles", "array")) {
        return { success: false, message: "missing roles key that should contain array" };
    }
    if (!verifyExist(dataToAdd, "anime", "object")) {
        return { success: false, message: "missing anime key that should be an object" };
    }
    const VALID_ROLES = ["TL", "TLC", "ENC", "ED", "TM", "TS", "QC"];
    const animeData = dataToAdd.anime;
    const serverId: string = dataToAdd.server;
    const logger = MainLogger.child({ cls: "ShowtimesPOST", fn: `AddNewProject[${serverId}]` });
    const animeId = animeData.id;
    const animeName = animeData.name;
    const expectedEpisode: number = animeData.episode;
    if (isNone(animeId) || isNone(animeName)) {
        return { success: false, message: "missing `id` or `name` or `episode` key on `anime` object" };
    }
    logger.info("Checking if anime exist on the database");
    const showServer = await ShowtimesModel.findOne({ id: { $eq: serverId } }, { "anime.id": 1 });
    let isExist = false;
    showServer.anime.forEach((res) => {
        if (res.id === animeId) {
            isExist = true;
        }
    });
    if (isExist) {
        logger.warn("Anime already exist, returning!");
        return {
            success: false,
            message: "Anime sudah terdaftar di daftar garapan, mohon gunakan mode edit!",
        };
    }
    const addedRoles = dataToAdd.roles;
    const validatedRoles = {
        TL: {
            id: null,
            name: null,
        },
        TLC: {
            id: null,
            name: null,
        },
        ENC: {
            id: null,
            name: null,
        },
        ED: {
            id: null,
            name: null,
        },
        TM: {
            id: null,
            name: null,
        },
        TS: {
            id: null,
            name: null,
        },
        QC: {
            id: null,
            name: null,
        },
    };
    const apiRequest = await getAnimeInfo(animeId);
    if (Object.keys(apiRequest).length < 1) {
        logger.error("Failed to fetch the API, got no results!");
        return { success: false, message: "Gagal mendapatkan dari Anilist, mohon coba lagi nanti!" };
    }
    logger.info("Parsing results...");
    const finalizedAnimeData = parseAnilistAPIResult(apiRequest, expectedEpisode);
    if (finalizedAnimeData.status.length < 1) {
        return {
            success: false,
            message:
                // eslint-disable-next-line max-len
                "Mohon maaf, anime tidak bisa ditambahkan karena tidak ada waktu tayang yang pasti, mohon coba lagi nanti",
        };
    }
    const cachedUserID = {};
    for (let i = 0; i < addedRoles.length; i++) {
        const element = addedRoles[i];
        if (VALID_ROLES.includes(element.role.toUpperCase()) && !isNone(element.id)) {
            if (!has(cachedUserID, element.id)) {
                try {
                    logger.info(`Requesting user info for role ${element.role} with ID ${element.id}`);
                    const userData = await emitSocketAndWait("get user", element.id);
                    validatedRoles[element.role].id = element.id;
                    if (userData.name) {
                        validatedRoles[element.role].name = userData.name;
                        cachedUserID[element.id] = userData.name;
                    } else {
                        cachedUserID[element.id] = null;
                    }
                } catch (e) {
                    logger.error(`Failed to fetch user ${element.id}, reason: ${e.toString()}`);
                    validatedRoles[element.role].id = element.id;
                    cachedUserID[element.id] = null;
                }
            } else {
                logger.info(`Using cached data for ${element.role} with ID ${element.id}`);
                validatedRoles[element.role].id = element.id;
                validatedRoles[element.role].name = get(cachedUserID, element.id, null);
            }
        }
    }
    let generatedRole;
    try {
        logger.info(`Generating new role on server with name: ${animeName}`);
        generatedRole = await emitSocketAndWait("create role", { id: serverId, name: animeName });
    } catch (e) {
        logger.error(`Failed to generate new role, reason: ${e.toString()}`);
        return { success: false, message: e.toString() };
    }

    const roleId = generatedRole.id;
    logger.info(`Fetching Anime information for ${animeId}`);
    finalizedAnimeData.role_id = roleId;
    finalizedAnimeData.assignments = validatedRoles;
    logger.info("Updating by pushing the new finalized data to the database...");
    try {
        await ShowtimesModel.updateOne(
            { id: { $eq: serverId } },
            { $addToSet: { anime: finalizedAnimeData } }
        );
    } catch (err) {
        logger.error("Failed to update the server state, returning an undefined data...");
        console.error(err);
        return { success: false, message: "Gagal memperbaharui database, mohon coba lagi nanti" };
    }
    logger.info("Emitting pull data request for server to Bot");
    emitSocket("pull data", serverId);
    return { success: true, message: "success" };
}

APIPOSTRoutes.use(express.json());

APIPOSTRoutes.post("/projek", ensureLoggedIn("/"), async (req, res) => {
    const reqData = req.body;
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            res.status(504).json({ done: false });
        } else {
            const result = await addNewProject(reqData);
            res.json({ ...result });
        }
    }
});

// lgtm [js/missing-token-validation]
APIPOSTRoutes.post("/authsocket", ensureLoggedIn("/"), async (req, res) => {
    // lgtm [js/missing-token-validation]
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            try {
                await emitSocketAndWait("authenticate", process.env.BOT_SOCKET_PASSWORD);
                res.json({ done: true, message: "done" });
            } catch (e) {
                res.status(500).json({ done: false, message: e.toString() });
            }
        } else {
            res.status(403).json({ done: false, message: "admin only" });
        }
    }
});

export { APIPOSTRoutes };
