import _ from "lodash";
import { NextApiResponse } from "next";

import dbConnect from "../../../lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../lib/session";
import { emitSocket } from "../../../lib/socket";

import { ShowAdminModel, ShowAnimeProps, ShowtimesModel } from "../../../models/show";
import { UserModel } from "../../../models/user";

async function deleteAndUnlinkEverything(serverId: string) {
    const serverData = await ShowtimesModel.findOne({ id: { $eq: serverId } });
    const serverAdmins = serverData.serverowner;
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
        await ShowAdminModel.findOneAndDelete({ id: { $eq: elemDel } });
        emitSocket("delete admin", elemDel);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [adminId, srvList] of Object.entries(shouldBeUpdated)) {
        // @ts-ignore
        await ShowAdminModel.findOneAndUpdate({ id: { $eq: adminId } }, { $set: { servers: srvList } });
        emitSocket("pull admin", adminId);
    }

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

    for (let i = 0; i < unlinkKolaborasi.length; i++) {
        const unlink = unlinkKolaborasi[i];
        const osrvData = await ShowtimesModel.findOne({ id: { $eq: unlink.id } }, { anime: 1 });
        const animeId = _.findIndex(osrvData.anime, (o: ShowAnimeProps) => o.id === unlink.animeId);
        if (animeId === -1) return;
        let kolebData = osrvData.anime[animeId].kolaborasi;
        if (kolebData.length < 1) return;
        kolebData = kolebData.filter((o) => o !== serverId);
        if (kolebData.length === 1 && kolebData[0] === unlink.id) {
            kolebData = [];
        }
        const animeSet = `anime.${animeId}.kolaborasi`;
        const $setsData = {};
        $setsData[animeSet] = kolebData;
        await ShowtimesModel.updateOne({ id: { $eq: unlink.id } }, { $set: $setsData });
    }

    await ShowtimesModel.deleteOne({ id: { $eq: serverId } });
    await UserModel.deleteOne({ id: { $eq: serverId } });
    emitSocket("delete server", serverId);
    if (removeRoles.length > 0) {
        emitSocket("delete roles", { id: serverId, roles: removeRoles });
    }
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
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
            try {
                await deleteAndUnlinkEverything(user.id);
                await req.session.destroy();
                res.json({ success: true, message: "sukses" });
            } catch (e) {
                res.json({ success: false, message: `An error occured: ${e.toString()}` });
            }
        }
    }
});
