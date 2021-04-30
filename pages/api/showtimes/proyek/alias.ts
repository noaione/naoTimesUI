import _ from "lodash";
import { NextApiResponse } from "next";

import dbConnect from "../../../../lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../../lib/session";
import { emitSocket } from "../../../../lib/socket";
import { verifyExist } from "../../../../lib/utils";

import { ShowAnimeProps, ShowtimesModel } from "../../../../models/show";

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
        // @ts-ignore
        await ShowtimesModel.findOneAndUpdate({ id: { $eq: serverId } }, { $set: $setsData });
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
        await dbConnect();
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
