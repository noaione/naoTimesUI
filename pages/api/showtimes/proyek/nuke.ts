import { has } from "lodash";
import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import { isNone, Nullable } from "@/lib/utils";
import { emitSocket } from "@/lib/socket";
import prisma from "@/lib/prisma";

async function checkAndRemoveCollabID(target_server: string, source_srv: string, anime_id: string) {
    const fetchServer = await prisma.showtimesdatas.findFirst({ where: { id: target_server } });
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
    await prisma.showtimesdatas.update({
        where: { mongo_id: fetchServer.mongo_id },
        data: {
            anime: {
                updateMany: {
                    where: { id: fetchServer.anime[animeIdx].id },
                    data: {
                        kolaborasi: { set: kolaborasiData },
                    },
                },
            },
        },
    });
    return true;
}

async function deleteAnimeId(anime_id: string, server_id: string) {
    const fetchServers = await prisma.showtimesdatas.findFirst({ where: { id: server_id } });
    if (isNone(fetchServers)) {
        return { message: "Tidak dapat menemukan server anda di database!", code: 4501, success: false };
    }
    const matchingAnime = fetchServers.anime.filter((res) => res.id === anime_id);
    if (matchingAnime.length < 1) {
        return { message: "Tidak dapat menemukan Anime tersebut di database!", code: 4301, success: false };
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
    const removeRoles = [matched.role_id];
    if (matched.kolaborasi.length > 0) {
        const deletionRequest = matched.kolaborasi.map((osrv_id) =>
            checkAndRemoveCollabID(osrv_id, server_id, matched.id)
                .then((_res) => {
                    emitSocket("pull data", osrv_id);
                    return true;
                })
                .catch((err) => {
                    emitSocket("pull data", osrv_id);
                    console.error(err);
                    return false;
                })
        );
        await Promise.all(deletionRequest);
    }
    try {
        await prisma.showtimesdatas.update({
            where: {
                mongo_id: fetchServers.mongo_id,
            },
            data: {
                anime: {
                    deleteMany: {
                        where: {
                            id: anime_id,
                        },
                    },
                },
            },
        });
    } catch (e) {
        console.error(e);
        return {
            message: "Gagal menghapus proyek dari database, mohon coba lagi nanti!",
            code: 4502,
            success: false,
        };
    }
    if (shouldAnnounce) {
        emitSocket("announce drop", {
            id: server_id,
            channel_id: fetchServers.announce_channel,
            anime: { id: matched.id, title: matched.title },
        });
    }
    emitSocket("pull data", server_id);
    if (removeRoles.length > 0) {
        emitSocket("delete roles", { id: server_id, roles: removeRoles });
    }
    return { message: "Sukses", code: 200, success: true };
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
    const jsonBody = await req.body;
    if (!has(jsonBody, "animeId")) {
        return res.status(400).json({ success: false, message: "Missing `animeId` key", code: 400 });
    }
    if (!user) {
        res.status(403).json({ success: false, message: "Unauthorized", code: 403 });
    } else {
        if (user.privilege === "owner") {
            res.status(501).json({
                success: false,
                message: "Sorry, this API routes is not implemented",
                code: 501,
            });
        } else {
            const results = await deleteAnimeId(jsonBody.animeId, user.id);
            let code = results.code;
            if (code === 4301) {
                code = 400;
            } else if (code == 4501) {
                code = 500;
            }
            res.status(code).json({ ...results });
        }
    }
});
