import axios from "axios";
import { get, has } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../../../lib/dbConnect";
import withSession from "../../../../lib/session";
import { emitSocket, emitSocketAndWait } from "../../../../lib/socket";
import { isNone, Nullable, parseAnilistAPIResult, verifyExist } from "../../../../lib/utils";

import { ShowtimesModel } from "../../../../models/show";
import { UserProps } from "../../../../models/user";

interface SessionClass {
    get<T extends any>(key: string): Nullable<T>;
}

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
    const animeId = animeData.id;
    const animeName = animeData.name;
    const expectedEpisode: number = animeData.episode;
    if (isNone(animeId) || isNone(animeName)) {
        return { success: false, message: "missing `id` or `name` or `episode` key on `anime` object" };
    }
    const showServer = await ShowtimesModel.findOne({ id: { $eq: serverId } }, { "anime.id": 1 });
    let isExist = false;
    showServer.anime.forEach((res) => {
        if (res.id === animeId) {
            isExist = true;
        }
    });
    if (isExist) {
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
        return { success: false, message: "Gagal mendapatkan dari Anilist, mohon coba lagi nanti!" };
    }
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
                    const userData = await emitSocketAndWait("get user", element.id);
                    validatedRoles[element.role].id = element.id;
                    if (userData.name) {
                        validatedRoles[element.role].name = userData.name;
                        cachedUserID[element.id] = userData.name;
                    } else {
                        cachedUserID[element.id] = null;
                    }
                } catch (e) {
                    validatedRoles[element.role].id = element.id;
                    cachedUserID[element.id] = null;
                }
            } else {
                validatedRoles[element.role].id = element.id;
                validatedRoles[element.role].name = get(cachedUserID, element.id, null);
            }
        }
    }
    let generatedRole;
    try {
        generatedRole = await emitSocketAndWait("create role", { id: serverId, name: animeName });
    } catch (e) {
        return { success: false, message: e.toString() };
    }

    const roleId = generatedRole.id;
    finalizedAnimeData.role_id = roleId;
    finalizedAnimeData.assignments = validatedRoles;
    try {
        await ShowtimesModel.updateOne(
            { id: { $eq: serverId } },
            // @ts-ignore
            { $addToSet: { anime: finalizedAnimeData } }
        );
    } catch (err) {
        console.error(err);
        return { success: false, message: "Gagal memperbaharui database, mohon coba lagi nanti" };
    }
    emitSocket("pull data", serverId);
    return { success: true, message: "success" };
}

export default withSession(async (req: NextApiRequest & { session: SessionClass }, res: NextApiResponse) => {
    const user = req.session.get<UserProps>("user");
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
            const bodyBag = await req.body;
            const result = await addNewProject(bodyBag);
            res.json({ ...result });
        }
    }
});