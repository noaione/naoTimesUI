import _ from "lodash";
import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import { emitSocket } from "@/lib/socket";
import { isNone, verifyExist } from "@/lib/utils";
import { Project } from "@prisma/client";
import prisma from "@/lib/prisma";

async function tryToAdjustAliasesData(serverId: string, animeId: string, aliases: string[]) {
    let animeData: Project[] = [];
    let mongoId: string;
    try {
        const rawData = await prisma.showtimesdatas.findFirst({ where: { id: serverId } });
        if (isNone(rawData)) {
            return [aliases, "Tidak dapat menghubungi database, mohon coba lagi nanti", false];
        }
        mongoId = rawData.mongo_id;
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

    try {
        await prisma.showtimesdatas.update({
            where: { mongo_id: mongoId },
            data: {
                anime: {
                    updateMany: {
                        where: {
                            id: animeData[animeIdx].id,
                        },
                        data: {
                            aliases: verifiedList,
                        },
                    },
                },
            },
        });
    } catch (e) {
        return [aliases, "Gagal memperbarui database, mohon coba lagi nanti", false];
    }
    emitSocket("pull data", serverId);
    return [verifiedList, "sukses", true];
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
    const jsonBody = await req.body;
    if (!verifyExist(jsonBody, "animeId", "string")) {
        return res.status(400).json({ message: "Missing animeId key", code: 400 });
    }
    if (!verifyExist(jsonBody, "aliases", "array")) {
        return res.status(400).json({ message: "Missing aliases key", code: 400 });
    }

    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        if (user.privilege === "owner") {
            res.status(501).json({
                message: "Sorry, this API routes is not implemented",
                code: 501,
            });
        } else {
            const [newaliases, msg, status] = await tryToAdjustAliasesData(
                user.id,
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
