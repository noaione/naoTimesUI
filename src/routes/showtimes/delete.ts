import _ from "lodash";
import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";

import { isNone, Nullable } from "../../lib/utils";
import { logger as MainLogger } from "../../lib/logger";
import { emitSocket } from "../../lib/socket";
import { ShowtimesModel } from "../../models/show";
import { UserProps } from "../../models/user";

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

export { APIDeleteRoutes };
