import { ensureLoggedIn } from "connect-ensure-login";
import express from "express";
import _ from "lodash";

import { logger as MainLogger } from "../../lib/logger";
import { emitSocket } from "../../lib/socket";
import { isNone, Nullable } from "../../lib/utils";
import { ShowAdminModel, ShowtimesModel } from "../../models/show";
import { UserModel, UserProps } from "../../models/user";

const APIDeleteRoutes = express.Router();

APIDeleteRoutes.use(express.json());

async function checkAndRemoveCollabID(target_server: string, source_srv: string, anime_id: string) {
    const fetchServer = await ShowtimesModel.findOne({ id: { $eq: target_server } });
    let animeIdx: Nullable<number> = null;
    for (let i = 0; i < fetchServer.anime.length; i++) {
        const animeElem = fetchServer.anime[i];
        if (animeElem.id === anime_id) {
            animeIdx = i;
            break;
        }
    }
    if (isNone(animeIdx)) {
        return false;
    }
    let kolaborasiData = fetchServer.anime[animeIdx].kolaborasi;
    if (kolaborasiData.length < 1) {
        return false;
    }
    if (kolaborasiData.includes(source_srv)) {
        kolaborasiData = kolaborasiData.filter((res) => res !== source_srv);
    }
    let removeCompletely = false;
    if (kolaborasiData.length === 1) {
        if (kolaborasiData.includes(target_server)) {
            removeCompletely = true;
        }
    }
    if (removeCompletely) {
        kolaborasiData = [];
    }
    fetchServer.anime[animeIdx].kolaborasi = kolaborasiData;
    await ShowtimesModel.updateOne({ id: { $eq: target_server } }, { $set: fetchServer });
    return true;
}

async function deleteAnimeId(anime_id: string, server_id: string) {
    const logger = MainLogger.child({
        cls: `ShowtimesDelete[${server_id}]`,
        fn: `deleteAnimeId[${anime_id}]`,
    });
    logger.info("Checking if anime exist...");
    const fetchServers = await ShowtimesModel.findOne({ id: { $eq: server_id } });
    const matchingAnime = fetchServers.anime.filter((res) => res.id === anime_id);
    if (matchingAnime.length < 1) {
        logger.warn("Cannot find matchin anime, ignoring");
        return { message: "cannot find anime in the database!", code: 400, success: false };
    }
    const matched = matchingAnime[0];
    let anyDone = false;
    let allDone = true;
    for (let i = 0; i < matched.status.length; i++) {
        const statusEp = matched.status[i];
        if (statusEp.is_done) {
            anyDone = true;
        }
        if (!statusEp.is_done) {
            allDone = false;
        }
    }
    let shouldAnnounce = true;
    if (allDone) {
        shouldAnnounce = false;
    } else if (!anyDone) {
        shouldAnnounce = false;
    }
    if (matched.kolaborasi.length > 0) {
        logger.info("Detected collaboration data, removing for now...");
        const deletionRequest = matched.kolaborasi.map((osrv_id) =>
            checkAndRemoveCollabID(osrv_id, server_id, matched.id)
                .then((_res) => {
                    emitSocket("pull data", osrv_id);
                    logger.info(`Removed ${server_id} from the Collaboration data of server ${osrv_id}`);
                    return true;
                })
                .catch((err) => {
                    emitSocket("pull data", osrv_id);
                    logger.error(`Failed to remove ${server_id} collab data from server ${osrv_id}`);
                    console.error(err);
                    return false;
                })
        );
        await Promise.all(deletionRequest);
    }
    logger.info(`Deleting anime from database, will announce? ${shouldAnnounce}`);
    try {
        await ShowtimesModel.updateOne({ id: { $eq: server_id } }, { $pull: { anime: { id: anime_id } } });
    } catch (e) {
        logger.error("Failed to remove anime from database, returning data for now....");
        console.error(e);
        return {
            message: "Gagal menghapus proyek dari database, mohon coba lagi nanti!",
            code: 500,
            success: false,
        };
    }
    if (shouldAnnounce) {
        logger.info("Emitting drop announcement");
        emitSocket("announce drop", {
            id: server_id,
            channel_id: fetchServers.announce_channel,
            anime: { id: matched.id, title: matched.title },
        });
    }
    logger.info("Emitting pull data to the server.");
    emitSocket("pull data", server_id);
    logger.info("Wrapping up everything!");
    return { message: "Sukses", code: 200, success: true };
}

APIDeleteRoutes.delete("/projek", ensureLoggedIn("/"), async (req, res) => {
    const jsonBody = req.body;
    if (!_.has(jsonBody, "anime_id")) {
        return res.status(400).json({ message: "missing `anime_id` key", code: 400 });
    }
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            res.status(504).json({ code: 504, message: "not implemented for Admin user" });
        } else {
            const results = await deleteAnimeId(jsonBody.anime_id, userData.id);
            res.status(results.code).json({ ...results });
        }
    }
});

async function deleteAndUnlinkEverything(serverId: string) {
    const logger = MainLogger.child({
        cls: `ShowtimesDelete[${serverId}]`,
        fn: "deleteAndUnlink",
    });
    logger.info("Fetching server data...");
    const serverData = await ShowtimesModel.findOne({ id: { $eq: serverId } });
    const serverAdmins = serverData.serverowner;
    logger.info("Fetching super admins data...");
    const showAdmins = await ShowAdminModel.find({});
    const shouldBeDeleted = [];
    const shouldBeUpdated: { [key: string]: string[] } = {};
    showAdmins.forEach((admins) => {
        if (serverAdmins.includes(admins.id)) {
            if (admins.servers.includes(serverId)) {
                const newServerSets = admins.servers.filter((res) => res !== serverId);
                if (newServerSets.length > 0) {
                    shouldBeUpdated[admins.id] = newServerSets;
                } else {
                    shouldBeDeleted.push(admins.id);
                }
            }
        }
    });

    for (let i = 0; i < shouldBeDeleted.length; i++) {
        const elemDel = shouldBeDeleted[i];
        logger.info(`Deleting ${elemDel} from database...`);
        await ShowAdminModel.findOneAndDelete({ id: { $eq: elemDel } });
        emitSocket("delete admin", elemDel);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [adminId, srvList] of Object.entries(shouldBeUpdated)) {
        logger.info(`Updating ${adminId}...`);
        await ShowAdminModel.findOneAndUpdate({ id: { $eq: adminId } }, { $set: { servers: srvList } });
        emitSocket("pull admin", adminId);
    }

    logger.info("Checking collaboration data...");
    const unlinkKolaborasi = [];
    let removeRoles = [];
    serverData.anime.forEach((anime) => {
        removeRoles.push(anime.role_id);
        anime.kolaborasi.forEach((srvId) => {
            if (srvId === serverId) {
                return;
            }
            unlinkKolaborasi.push({ id: srvId, animeId: anime.id });
        });
    });
    removeRoles = removeRoles.filter((res) => typeof res === "string");

    logger.info(`Will unlink ${unlinkKolaborasi.length} collaboration data!`);
    for (let i = 0; i < unlinkKolaborasi.length; i++) {
        const unlink = unlinkKolaborasi[i];
        const osrvData = await ShowtimesModel.findOne({ id: { $eq: unlink.id } }, { anime: 1 });
        const animeId = _.findIndex(osrvData.anime, (o) => o.id === unlink.animeId);
        if (animeId === -1) return;
        let kolebData = osrvData.anime[animeId].kolaborasi;
        if (kolebData.length < 1) return;
        kolebData = kolebData.filter((o) => o !== serverId);
        if (kolebData.length === 1 && kolebData[0] === unlink.id) {
            kolebData = [];
        }
        const animeSet = `anime.${animeId}.kolaborasi`;
        logger.info(`Unlinking anime data at index ${animeId} on server ${unlink.id}`);
        const $setsData = {};
        $setsData[animeSet] = kolebData;
        await ShowtimesModel.updateOne({ id: { $eq: unlink.id } }, { $set: $setsData });
    }

    logger.info("Deleting the server from database");
    await ShowtimesModel.deleteOne({ id: { $eq: serverId } });
    logger.info("Server deleted, removing from User database");
    await UserModel.deleteOne({ id: { $eq: serverId } });
    logger.info("Cleaning up...");
    emitSocket("delete server", serverId);
    emitSocket("delete roles", { id: serverId, roles: removeRoles });
}

APIDeleteRoutes.delete("/server", ensureLoggedIn("/"), async (req, res) => {
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            res.status(504).json({ code: 504, message: "Not implemented" });
        } else {
            try {
                await deleteAndUnlinkEverything(userData.id);
                req.logOut();
                res.json({ code: 200 });
            } catch (e) {
                res.json({ code: 500 });
            }
        }
    }
});

export { APIDeleteRoutes };
