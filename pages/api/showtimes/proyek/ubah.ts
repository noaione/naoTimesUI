import prisma from "@/lib/prisma";
import { showtimesdatas } from "@prisma/client";
import _ from "lodash";
import { DateTime } from "luxon";
import { NextApiResponse } from "next";

import withSession, { getServerUser, NextApiRequestWithSession } from "@/lib/session";
import { emitSocket, emitSocketAndWait } from "@/lib/socket";
import { isNone, Nullable, RoleProject, verifyExist } from "@/lib/utils";

type AnimeChangeEvent = "staff" | "status";

interface StatusRoleChanges {
    role?: RoleProject;
    tick?: boolean;
}

function verifyChangesContents(event: AnimeChangeEvent, changes: any) {
    if (event === "staff") {
        return (
            verifyExist(changes, "role", "string") &&
            verifyExist(changes, "anime_id", "string") &&
            verifyExist(changes, "user_id", "string")
        );
    }
    if (event === "status") {
        const episode =
            verifyExist(changes, "episode", "string") || verifyExist(changes, "episode", "number");
        return (
            verifyExist(changes, "roles", "array") && verifyExist(changes, "anime_id", "string") && episode
        );
    }
    return false;
}

async function doAnimeChanges(event: AnimeChangeEvent, databaseData: showtimesdatas, changes: any) {
    if (event === "staff") {
        let { role } = changes;
        if (isNone(role)) {
            return null;
        }
        if (!["TL", "TLC", "ENC", "ED", "TM", "TS", "QC"].includes(role)) {
            return null;
        }
        const { anime_id } = changes;
        if (isNone(anime_id)) return null;
        const indexAnime = _.findIndex(databaseData.anime, (pred) => pred.id === anime_id);
        if (indexAnime === -1) return null;
        role = role.toUpperCase();
        let userId: Nullable<string> = changes.user_id;
        if (typeof userId !== "string") {
            userId = "";
        }
        let userName: Nullable<string> = null;
        try {
            const userInfo = await emitSocketAndWait("get user", userId);
            userName = userInfo.name;
        } catch (e) {}
        const newUserData = { id: userId, name: userName };
        const assignments = databaseData.anime[indexAnime].assignments;
        assignments[role] = newUserData;
        await prisma.showtimesdatas.update({
            where: { mongo_id: databaseData.mongo_id },
            data: {
                anime: {
                    updateMany: {
                        where: { id: anime_id },
                        data: {
                            assignments: assignments,
                        },
                    },
                },
            },
        });
        return newUserData;
    }
    if (event === "status") {
        const rolesSets: Nullable<StatusRoleChanges[]> = changes.roles;
        if (isNone(rolesSets)) {
            return null;
        }
        const verifiedChanges: StatusRoleChanges[] = [];
        rolesSets.forEach((res) => {
            if (isNone(res.role)) return;
            const role = res.role.toUpperCase() as RoleProject;
            if (!["TL", "TLC", "ENC", "ED", "TM", "TS", "QC"].includes(role)) return;
            if (typeof res.tick !== "boolean") return;
            verifiedChanges.push({ role, tick: res.tick });
        });
        const { anime_id } = changes;
        if (isNone(anime_id)) return null;
        let episode_no: Nullable<number | string> = changes.episode;
        if (isNone(episode_no)) return null;
        if (typeof episode_no === "string") {
            episode_no = parseInt(episode_no);
            if (Number.isNaN(episode_no)) return null;
        }
        if (typeof episode_no !== "number") return null;
        const currentUTC = DateTime.utc().toSeconds();
        const indexAnime = _.findIndex(databaseData.anime, (pred) => pred.id === anime_id);
        if (indexAnime === -1) return null;
        const animeInfo = databaseData.anime[indexAnime];
        const indexEpisode = _.findIndex(animeInfo.status, (pred) => pred.episode === episode_no);
        if (indexEpisode === -1) return null;
        const status = animeInfo.status[indexEpisode];
        verifiedChanges.forEach((res) => {
            status.progress[res.role] = res.tick;
        });
        await prisma.showtimesdatas.update({
            where: { mongo_id: databaseData.mongo_id },
            data: {
                anime: {
                    updateMany: {
                        where: { id: anime_id },
                        data: {
                            status: {
                                updateMany: {
                                    where: {
                                        episode: status.episode,
                                    },
                                    data: {
                                        progress: status.progress,
                                    },
                                },
                            },
                            last_update: {
                                set: parseInt(currentUTC.toString(), 10),
                            },
                        },
                    },
                },
            },
        });
        return status.progress;
    }
    return null;
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const jsonBody = await req.body;
    const userData = getServerUser(req);
    if (isNone(jsonBody) || Object.keys(jsonBody).length < 1) {
        return res
            .status(400)
            .json({ success: false, message: "Tidak dapat menemukan body di request", code: 400 });
    }
    const raweventType: Nullable<string> = jsonBody.event;
    if (isNone(raweventType)) {
        return res.status(400).json({ success: false, message: "`event` tidak dapat ditemukan", code: 400 });
    }
    const eventType = raweventType.toLowerCase() as AnimeChangeEvent;
    if (!["status", "staff"].includes(eventType)) {
        return res.status(400).json({ success: false, message: "Tipe `event` tidak diketahui", code: 4600 });
    }
    const { changes } = jsonBody;
    if (isNone(changes)) {
        return res
            .status(400)
            .json({ success: false, message: "Tidak ada data `changes` di request", code: 400 });
    }
    if (!verifyChangesContents(eventType, changes)) {
        return res.status(400).json({
            success: false,
            message: `Terdapat data yang kurang pada event ${eventType}`,
            code: 400,
        });
    }
    if (isNone(userData)) {
        res.status(403).json({
            success: false,
            message: "Tidak diperbolehkan untuk mengakses API ini",
            code: 403,
        });
    } else {
        if (userData.privilege === "owner") {
            const serverId = req.body.server;
            if (isNone(serverId)) {
                res.status(400).json({
                    success: false,
                    message: "Data `server` tidak dapat ditemukan",
                    code: 400,
                });
            } else {
                const serverData = await prisma.showtimesdatas.findFirst({
                    where: {
                        id: serverId,
                    },
                });
                if (isNone(serverData)) {
                    res.json({ success: false });
                } else {
                    const modifedData = await doAnimeChanges(eventType, serverData, changes);
                    emitSocket("pull data", serverId);
                    if (eventType === "staff") {
                        if (isNone(modifedData)) {
                            res.status(500).json({ success: false });
                        } else {
                            res.json({ ...modifedData, success: true });
                        }
                    } else if (eventType === "status") {
                        if (isNone(modifedData)) {
                            res.json({ results: null, success: false });
                        } else {
                            res.json({ success: true, results: { progress: modifedData } });
                        }
                    } else {
                        res.json({ results: null, success: false });
                    }
                }
            }
        } else {
            const serverData = await prisma.showtimesdatas.findFirst({
                where: {
                    id: userData.id,
                },
            });
            const modifedData = await doAnimeChanges(eventType, serverData, changes);
            emitSocket("pull data", userData.id);
            if (eventType === "staff") {
                if (isNone(modifedData)) {
                    res.status(500).json({ success: false });
                } else {
                    res.json({ ...modifedData, success: true });
                }
            } else if (eventType === "status") {
                if (isNone(modifedData)) {
                    res.json({ results: null, success: false });
                } else {
                    res.json({ success: true, results: { progress: modifedData } });
                }
            } else {
                res.json({ results: null, success: false });
            }
        }
    }
});
