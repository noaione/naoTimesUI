import { ensureLoggedIn } from "connect-ensure-login";
import express from "express";
import _ from "lodash";
import moment from "moment-timezone";

import { emitSocket, emitSocketAndWait } from "../../lib/socket";
import { isNone, Nullable, verifyExist } from "../../lib/utils";
import { ShowAdminModel, ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "../../models/show";
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
        let userName: Nullable<string> = null;
        try {
            const userInfo = await emitSocketAndWait("get user", userId);
            userName = userInfo.name;
        } catch (e) {}
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
        const currentUTC = moment.utc().unix();
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
        databaseData.anime[indexAnime].last_update = currentUTC;
        return databaseData;
    }
    return databaseData;
}

APIPutRoutes.put("/projek", ensureLoggedIn("/"), async (req, res) => {
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
                    res.json({ result: {}, success: false });
                } else {
                    res.json({ success: true, results: { progress: episodeInfo.progress } });
                }
            } else {
                res.json({ result: {}, success: false });
            }
        }
    }
});

async function tryToAdjustAdminData(serverId: string, newAdminIds: string[]) {
    if (newAdminIds.length < 1) {
        return ["Admin IDs kosong, mohon isi dengan Discord ID", false];
    }
    let successCheck1 = true;
    let failed = "";
    newAdminIds.forEach((admin) => {
        if (isNaN(parseInt(admin))) {
            successCheck1 = false;
            failed = admin;
        }
    });
    if (!successCheck1) {
        return [`Salah satu admin ID bukanlah angka: ${failed}`, false];
    }
    let successCheck2 = false;
    try {
        const showAdmin = await ShowAdminModel.find({});
        const serversAdminsSets: string[] = [];
        showAdmin.forEach((res) => {
            if (res.servers.includes(serverId)) {
                serversAdminsSets.push(res.id);
            }
        });
        serversAdminsSets.forEach((admin) => {
            if (newAdminIds.includes(admin)) {
                successCheck2 = true;
            }
        });
    } catch (e) {
        console.error(e);
        return ["Gagal mengambil database, mohon coba lagi nanti", false];
    }
    if (!successCheck2) {
        return ["Tidak dapat menemukan Server Admin utama dalam list baru, mohon cek lagi", false];
    }
    try {
        await ShowtimesModel.findOneAndUpdate(
            { id: { $eq: serverId } },
            { $set: { serverowner: newAdminIds } }
        );
    } catch (e) {
        return ["Gagal memperbarui database, mohon coba lagi nanti", false];
    }
    emitSocket("pull data", serverId);
    return ["sukses", true];
}

APIPutRoutes.put("/admin", ensureLoggedIn("/"), async (req, res) => {
    const jsonBody = req.body;
    if (isNone(jsonBody.adminids)) {
        res.status(400).json({ message: "missing adminids key", code: 400 });
    } else {
        if (isNone(req.user)) {
            res.status(403).json({ message: "Unauthorized", code: 403 });
        } else {
            const userData = req.user as UserProps;
            if (userData.privilege === "owner") {
                res.status(504).json({ message: "Not implemented for Admin", code: 504 });
            } else {
                const [msg, status] = await tryToAdjustAdminData(userData.id, jsonBody.adminids);
                if (status) {
                    res.json({ message: msg, code: 200 });
                } else {
                    res.status(500).json({ message: msg, code: 500 });
                }
            }
        }
    }
});

async function tryToAdjustAliasesData(serverId: string, animeId: string, aliases: string[]) {
    let animeData: ShowAnimeProps[] = [];
    try {
        const rawData = await ShowtimesModel.findOne({ id: { $eq: serverId } });
        animeData = rawData.anime;
    } catch (e) {
        return [aliases, "Tidak dapat menghubungi database, mohon coba lagi nanti", false];
    }

    const animeIdx = _.findIndex(animeData, (o) => o.id === animeId);
    if (animeIdx === -1) {
        return [aliases, "Tidak dapat menemukan Anime tersebut", false];
    }

    const verifiedList: string[] = [];
    aliases.forEach((res) => {
        if (typeof res === "string" && res && res !== "" && res !== " ") {
            verifiedList.push(res);
        }
    });

    const animeSet = `anime.${animeIdx}.aliases`;
    const $setsData = {};
    $setsData[animeSet] = verifiedList;

    try {
        await ShowtimesModel.findOneAndUpdate({ id: { $eq: serverId } }, { $set: $setsData });
    } catch (e) {
        return [aliases, "Gagal memperbarui database, mohon coba lagi nanti", false];
    }
    emitSocket("pull data", serverId);
    return [verifiedList, "sukses", true];
}

APIPutRoutes.put("/alias", ensureLoggedIn("/"), async (req, res) => {
    const jsonBody = req.body;
    if (!verifyExist(jsonBody, "animeId", "string")) {
        return res.status(400).json({ message: "Missing animeId key", code: 400 });
    }
    if (!verifyExist(jsonBody, "aliases", "array")) {
        return res.status(400).json({ message: "Missing aliases key", code: 400 });
    }

    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            res.status(504).json({ message: "Not implemented for Admin", code: 504 });
        } else {
            const [newaliases, msg, status] = await tryToAdjustAliasesData(
                userData.id,
                jsonBody.animeId,
                jsonBody.aliases
            );
            if (status) {
                res.json({ data: newaliases, message: msg, code: 200 });
            } else {
                res.status(500).json({ data: newaliases, message: msg, code: 500 });
            }
        }
    }
});

export { APIPutRoutes };
