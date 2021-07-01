import { DateTime } from "luxon";
import { NextApiResponse } from "next";

import dbConnect from "../../../../lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../../lib/session";
import { emitSocket } from "../../../../lib/socket";
import { isNone, Nullable, verifyExist } from "../../../../lib/utils";
import { EpisodeStatusProps, ShowtimesModel, ShowtimesProps } from "../../../../models/show";

type EpisodeUpdateEvent = "add" | "remove";

interface EpisodeUpdateChanges {
    episodes: (string | number)[];
    animeId: string;
}

function verifyContents(event: EpisodeUpdateEvent, changes: any) {
    if (typeof changes === "undefined") {
        return false;
    }
    if (event === "add" || event === "remove") {
        const episodeCheck = Array.isArray(changes.episodes) && changes.episodes > 0;
        return verifyExist(changes, "animeId", "string") && episodeCheck;
    }
    return false;
}

async function doEpisodeChanges(event: EpisodeUpdateEvent, serverId: string, changes: EpisodeUpdateChanges) {
    const serverData = (await ShowtimesModel.findOne({ id: { $eq: serverId } })) as ShowtimesProps;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const test = serverData.id;
    } catch (e) {
        return "Tidak dapat menemukan server anda di database?";
    }
    const { animeId, episodes } = changes;
    if (!Array.isArray(episodes)) {
        return "Tidak ada data `episodes` di request, mohon coba lagi!";
    }
    const onlyEpisodeNumbers = [] as number[];
    episodes.forEach((num) => {
        if (typeof num === "string") {
            const parsed = parseInt(num);
            // No dupes and only real number.
            if (!isNaN(parsed) && !onlyEpisodeNumbers.includes(parsed)) {
                onlyEpisodeNumbers.push(parsed);
            }
        } else if (typeof num === "number") {
            const roundedNum = Math.round(num);
            // No dupes.
            if (!onlyEpisodeNumbers.includes(roundedNum)) {
                onlyEpisodeNumbers.push(roundedNum);
            }
        }
    });
    if (onlyEpisodeNumbers.length < 1) {
        return "Tidak ada episode yang ingin ditambah.";
    }
    const { anime } = serverData;
    if (!Array.isArray(anime)) {
        return "Data anime tidak ada di database";
    }
    const animeIdxLoc = anime.findIndex((e) => e.id === animeId);
    if (animeIdxLoc < 0) {
        return "Tidak dapat menemukan Anime tersebut di database.";
    }
    const currentTime = DateTime.now().toUTC().startOf("hour").toSeconds();
    if (event === "add") {
        let status = anime[animeIdxLoc].status as EpisodeStatusProps[];
        const episodeNewData: EpisodeStatusProps[] = [];
        onlyEpisodeNumbers.forEach((episodeNum, idx) => {
            const statusLoc = status.findIndex((es) => es.episode === episodeNum);
            if (statusLoc !== -1) {
                let lastEpisode = status[episodeNum - 1];
                if (isNone(lastEpisode)) {
                    lastEpisode = status[status.length - 1];
                }
                let lastAirtime = lastEpisode.airtime;
                if (typeof lastAirtime !== "number") {
                    lastAirtime = currentTime;
                }
                episodeNewData.push({
                    episode: episodeNum,
                    is_done: false,
                    progress: {
                        TL: false,
                        TLC: false,
                        ENC: false,
                        ED: false,
                        TM: false,
                        TS: false,
                        QC: false,
                    },
                    airtime: lastAirtime + 604800 * idx,
                });
            }
        });
        status = status.concat(episodeNewData);
        const kolaborasiServer = anime[animeIdxLoc].kolaborasi.filter(
            (targetServer) => targetServer !== serverId
        );
        if (kolaborasiServer.length > 0) {
            const targetServers = (await ShowtimesModel.find({
                id: { $in: kolaborasiServer },
            })) as ShowtimesProps[];
            if (targetServers.length > 0) {
                targetServers.forEach(async (targetSrv) => {
                    const animeIdxTarget = targetSrv.anime.findIndex((pepela) => pepela.id === animeId);
                    if (animeIdxTarget < 0) {
                        return;
                    }
                    // @ts-ignore
                    targetSrv.anime[animeIdxTarget].status = status;
                    // @ts-ignore
                    await ShowtimesModel.updateOne({ id: { $eq: targetSrv.id } }, targetSrv);
                    emitSocket("pull data", targetSrv.id);
                });
            }
        }
        // @ts-ignore
        serverData.anime[animeIdxLoc].status = status;
        // @ts-ignore
        await ShowtimesModel.updateOne({ id: { $eq: serverId } }, serverData);
        emitSocket("pull data", serverId);
        return episodeNewData;
    } else if (event === "remove") {
        const status = anime[animeIdxLoc].status as EpisodeStatusProps[];
        const newStatus = status.filter((epStat) => !episodes.includes(epStat.episode));
        if (status.length !== newStatus.length) {
            // Change data
            const kolaborasiServer = anime[animeIdxLoc].kolaborasi.filter(
                (targetServer) => targetServer !== serverId
            );
            if (kolaborasiServer.length > 0) {
                const targetServers = (await ShowtimesModel.find({
                    id: { $in: kolaborasiServer },
                })) as ShowtimesProps[];
                if (targetServers.length > 0) {
                    targetServers.forEach(async (targetSrv) => {
                        const animeIdxTarget = targetSrv.anime.findIndex((pepela) => pepela.id === animeId);
                        if (animeIdxTarget < 0) {
                            return;
                        }
                        // @ts-ignore
                        targetSrv.anime[animeIdxTarget].status = newStatus;
                        // @ts-ignore
                        await ShowtimesModel.updateOne({ id: { $eq: targetSrv.id } }, targetSrv);
                        emitSocket("pull data", targetSrv.id);
                    });
                }
            }
            // @ts-ignore
            serverData.anime[animeIdxLoc].status = newStatus;
            // @ts-ignore
            await ShowtimesModel.updateOne({ id: { $eq: serverId } }, serverData);
            emitSocket("pull data", serverId);
            const removedEpisode = [];
            status.forEach((pp, idx) => {
                const indexed = newStatus.findIndex((x) => x.episode === pp.episode);
                if (indexed !== -1) {
                    removedEpisode.push({ episode: pp.episode, index: idx });
                }
            });
            return removedEpisode;
        } else {
            return "Tidak ada episode yang dihapus, pastikan episode itu terdapat di database.";
        }
    }
    return "Event perubahan tidak diketahui.";
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
    const eventType = raweventType.toLowerCase() as EpisodeUpdateEvent;
    if (!["add", "remove"].includes(eventType)) {
        return res.status(400).json({ message: "Tipe `event` tidak diketahui", code: 400 });
    }
    const { changes } = jsonBody;
    if (isNone(changes)) {
        return res.status(400).json({ message: "Tidak ada data `changes` di request", code: 400 });
    }
    if (!verifyContents(eventType, changes)) {
        return res
            .status(400)
            .json({ message: `Terdapat data yang kurang pada event ${eventType}`, code: 400 });
    }
    if (isNone(userData)) {
        res.status(403).json({ message: "Tidak diperbolehkan untuk mengakses API ini", code: 403 });
    } else {
        await dbConnect();
        if (userData.privilege === "owner") {
            res.status(504).json({ message: "Route not implemented yet", success: false });
        } else {
            const modifiedData = await doEpisodeChanges(
                eventType,
                userData.id,
                changes as EpisodeUpdateChanges
            );
            if (typeof modifiedData === "string") {
                res.status(500).json({ success: false, message: modifiedData });
            } else {
                res.json({ success: true, data: modifiedData, message: "Sukses" });
            }
        }
    }
});
