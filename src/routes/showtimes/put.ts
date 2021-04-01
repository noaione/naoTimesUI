import _ from "lodash";
import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";

import { isNone, Nullable, verifyExist } from "../../lib/utils";
import { emitSocketAndWait } from "../../lib/socket";
import { ShowtimesModel, ShowtimesProps } from "../../models/show";
import { UserProps } from "../../models/user";

const APIPutRoutes = express.Router();
APIPutRoutes.use(express.json());

type ProjectRole = "TL" | "TLC" | "ENC" | "ED" | "TM" | "TS" | "QC";
type AnimeChangeEvent = "staff" | "status";
interface StatusRoleChanges {
    role?: ProjectRole;
    tick?: boolean;
}

function verifyChangesContents(event: AnimeChangeEvent, changes: any) {
    if (event === "staff") {
        return (
            verifyExist(changes, "role", "string") &&
            verifyExist(changes, "anime_id", "string") &&
            verifyExist(changes, "user_id", "string")
        );
    } else if (event === "status") {
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
        let role: Nullable<string> = changes["role"];
        if (isNone(role)) {
            return databaseData;
        }
        if (!["TL", "TLC", "ENC", "ED", "TM", "TS", "QC"].includes(role)) {
            return databaseData;
        }
        const anime_id: Nullable<string> = changes["anime_id"];
        if (isNone(anime_id)) return databaseData;
        const indexAnime = _.findIndex(databaseData.anime, (pred) => pred.id === anime_id);
        if (indexAnime === -1) return databaseData;
        role = role.toUpperCase();
        const userId: Nullable<string> = changes["user_id"];
        if (isNone(userId)) return databaseData;
        const userInfo = await emitSocketAndWait("get user", userId);
        let userName: Nullable<string> = null;
        if (userInfo.success === 1) {
            userName = userInfo.name as string;
        }
        const newUserData = { id: userId, name: userName };
        databaseData.anime[indexAnime].assignments[role] = newUserData;
        return databaseData;
    } else if (event === "status") {
        const rolesSets: Nullable<StatusRoleChanges[]> = changes["roles"];
        if (isNone(rolesSets)) {
            return databaseData;
        }
        const verifiedChanges: StatusRoleChanges[] = [];
        rolesSets.forEach((res) => {
            if (isNone(res.role)) return;
            const role = res.role.toUpperCase() as ProjectRole;
            if (!["TL", "TLC", "ENC", "ED", "TM", "TS", "QC"].includes(role)) return;
            if (typeof res.tick !== "boolean") return;
            verifiedChanges.push({ role, tick: res.tick });
        });
        const anime_id: Nullable<string> = changes["anime_id"];
        if (isNone(anime_id)) return databaseData;
        let episode_no: Nullable<number | string> = changes["episode"];
        if (isNone(episode_no)) return databaseData;
        if (typeof episode_no === "string") {
            episode_no = parseInt(episode_no);
            if (isNaN(episode_no)) return databaseData;
        }
        if (typeof episode_no !== "number") return databaseData;
        const indexAnime = _.findIndex(databaseData.anime, (pred) => pred.id === anime_id);
        if (indexAnime === -1) return databaseData;
        const indexEpisode = _.findIndex(
            databaseData.anime[indexAnime].status,
            (pred) => pred.episode === episode_no
        );
        if (indexEpisode === -1) return databaseData;
        verifiedChanges.forEach((res) => {
            databaseData.anime[indexAnime].status[indexEpisode].progress[res.role] = res.tick;
        });
        return databaseData;
    }
    return databaseData;
}

APIPutRoutes.put("/anime/:anime_id", ensureLoggedIn("/"), async (req, res) => {
    const jsonBody = req.body;
    if (isNone(jsonBody) || Object.keys(jsonBody).length < 1) {
        return res.status(400).json({ message: "missing JSON body", code: 400 });
    }
    const raweventType: Nullable<string> = jsonBody.event;
    if (isNone(raweventType)) {
        return res.status(400).json({ message: "missing event type", code: 400 });
    }
    const eventType = raweventType.toLowerCase() as AnimeChangeEvent;
    if (!["status", "staff"].includes(eventType)) {
        return res.status(400).json({ message: "unknown event type", code: 400 });
    }
    const changes: Nullable<any> = jsonBody.changes;
    if (isNone(changes)) {
        return res.status(400).json({ message: "missing changes data", code: 400 });
    }
    if (!verifyChangesContents(eventType, changes)) {
        return res.status(400).json({ message: `missing expected data on event ${eventType}`, code: 400 });
    }
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            const serverId = req.body.server;
            if (isNone(serverId)) {
                res.status(400).json({ message: "Missing server key on JSON body", code: 400 });
            } else {
                const serverData = await ShowtimesModel.findOne({ id: { $eq: serverId } });
                if (isNone(serverData) || Object.keys(serverData).length < 1) {
                    res.json({ done: false });
                } else {
                    const modifedData = await doAnimeChanges(eventType, serverData, changes);
                    // @ts-ignore
                    await ShowtimesModel.updateOne({ id: { $eq: userData.id } }, modifedData);
                    res.json({ done: true });
                }
            }
        } else {
            const serverData = await ShowtimesModel.findOne({ id: { $eq: userData.id } });
            const modifedData = await doAnimeChanges(eventType, serverData, changes);
            // @ts-ignore
            await ShowtimesModel.updateOne({ id: { $eq: userData.id } }, modifedData);
            res.json({ done: true });
        }
    }
});

export { APIPutRoutes };
