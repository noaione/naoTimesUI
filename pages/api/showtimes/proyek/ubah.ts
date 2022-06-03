import _ from "lodash";
import { DateTime } from "luxon";
import { NextApiResponse } from "next";

import dbConnect from "../../../../lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../../lib/session";
import { emitSocket, emitSocketAndWait } from "../../../../lib/socket";
import { isNone, Nullable, RoleProject, verifyExist } from "../../../../lib/utils";

import { ShowtimesModel, ShowtimesProps } from "../../../../models/show";

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

async function doAnimeChanges(
    event: AnimeChangeEvent,
    databaseData: ShowtimesProps,
    changes: any
): Promise<ShowtimesProps> {
    if (event === "staff") {
        let { role } = changes;
        if (isNone(role)) {
            return databaseData;
        }
        if (!["TL", "TLC", "ENC", "ED", "TM", "TS", "QC"].includes(role)) {
            return databaseData;
        }
        const { anime_id } = changes;
        if (isNone(anime_id)) return databaseData;
        const indexAnime = _.findIndex(databaseData.anime, (pred) => pred.id === anime_id);
        if (indexAnime === -1) return databaseData;
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
        // eslint-disable-next-line no-param-reassign
        databaseData.anime[indexAnime].assignments[role] = newUserData;
        return databaseData;
    }
    if (event === "status") {
        const rolesSets: Nullable<StatusRoleChanges[]> = changes.roles;
        if (isNone(rolesSets)) {
            return databaseData;
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
        if (isNone(anime_id)) return databaseData;
        let episode_no: Nullable<number | string> = changes.episode;
        if (isNone(episode_no)) return databaseData;
        if (typeof episode_no === "string") {
            episode_no = parseInt(episode_no);
            if (Number.isNaN(episode_no)) return databaseData;
        }
        if (typeof episode_no !== "number") return databaseData;
        const currentUTC = DateTime.utc().toSeconds();
        const indexAnime = _.findIndex(databaseData.anime, (pred) => pred.id === anime_id);
        if (indexAnime === -1) return databaseData;
        const indexEpisode = _.findIndex(
            databaseData.anime[indexAnime].status,
            (pred) => pred.episode === episode_no
        );
        if (indexEpisode === -1) return databaseData;
        verifiedChanges.forEach((res) => {
            // eslint-disable-next-line no-param-reassign
            databaseData.anime[indexAnime].status[indexEpisode].progress[res.role] = res.tick;
        });
        // eslint-disable-next-line no-param-reassign
        databaseData.anime[indexAnime].last_update = currentUTC;
        return databaseData;
    }
    return databaseData;
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const jsonBody = await req.body;
    const userData = req.session.get<IUserAuth>("user");
    if (isNone(jsonBody) || Object.keys(jsonBody).length < 1) {
        return res.status(400).json({ message: "Tidak dapat menemukan body di request", code: 400 });
    }
    const raweventType: Nullable<string> = jsonBody.event;
    if (isNone(raweventType)) {
        return res.status(400).json({ message: "`event` tidak dapat ditemukan", code: 400 });
    }
    const eventType = raweventType.toLowerCase() as AnimeChangeEvent;
    if (!["status", "staff"].includes(eventType)) {
        return res.status(400).json({ message: "Tipe `event` tidak diketahui", code: 400 });
    }
    const { changes } = jsonBody;
    if (isNone(changes)) {
        return res.status(400).json({ message: "Tidak ada data `changes` di request", code: 400 });
    }
    if (!verifyChangesContents(eventType, changes)) {
        return res
            .status(400)
            .json({ message: `Terdapat data yang kurang pada event ${eventType}`, code: 400 });
    }
    if (isNone(userData)) {
        res.status(403).json({ message: "Tidak diperbolehkan untuk mengakses API ini", code: 403 });
    } else {
        await dbConnect();
        if (userData.privilege === "owner") {
            const serverId = req.body.server;
            if (isNone(serverId)) {
                res.status(400).json({ message: "Data `server` tidak dapat ditemukan", code: 400 });
            } else {
                const serverData = await ShowtimesModel.findOne({ id: { $eq: serverId } });
                if (isNone(serverData) || Object.keys(serverData).length < 1) {
                    res.json({ success: false });
                } else {
                    const modifedData = await doAnimeChanges(eventType, serverData, changes);
                    // @ts-ignore
                    await ShowtimesModel.updateOne({ id: { $eq: userData.id } }, modifedData);
                    if (eventType === "staff") {
                        const roleChange = changes.role;
                        const indexAnime = _.findIndex(
                            modifedData.anime,
                            (pred) => pred.id === changes.anime_id
                        );
                        const roleChanges = modifedData.anime[indexAnime].assignments[roleChange];
                        res.json({ ...roleChanges, success: true });
                    } else {
                        res.json({ success: false });
                    }
                }
            }
        } else {
            const serverData = await ShowtimesModel.findOne({ id: { $eq: userData.id } });
            const modifedData = await doAnimeChanges(eventType, serverData, changes);
            // @ts-ignore
            await ShowtimesModel.updateOne({ id: { $eq: userData.id } }, modifedData);
            emitSocket("pull data", userData.id);
            if (eventType === "staff") {
                const roleChange = changes.role;
                const indexAnime = _.findIndex(modifedData.anime, (pred) => pred.id === changes.anime_id);
                const roleChanges = modifedData.anime[indexAnime].assignments[roleChange];
                res.json({ ...roleChanges, success: true });
            } else if (eventType === "status") {
                const indexAnime = _.findIndex(modifedData.anime, (pred) => pred.id === changes.anime_id);
                const episodeSets = modifedData.anime[indexAnime].status;
                const episodeInfo = _.find(episodeSets, (o) => o.episode === parseInt(changes.episode));
                if (isNone(episodeInfo)) {
                    res.json({ results: null, success: false });
                } else {
                    res.json({ success: true, results: { progress: episodeInfo.progress } });
                }
            } else {
                res.json({ results: null, success: false });
            }
        }
    }
});
