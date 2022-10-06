import _ from "lodash";
import { NextApiResponse } from "next";

import withSession, { getServerUser, NextApiRequestWithSession, removeServerUser } from "@/lib/session";
import { emitSocket } from "@/lib/socket";
import prisma from "@/lib/prisma";
import { Project } from "@prisma/client";
import { isNone } from "@/lib/utils";

type AnyDict<T> = { [key: string]: T };

async function deleteAndUnlinkEverything(serverId: string) {
    const serverData = await prisma.showtimesdatas.findFirst({ where: { id: serverId } });
    const serverAdmins = serverData.serverowner;
    const showAdmins = await prisma.showtimesadmin.findMany();
    const shouldBeDeleted: AnyDict<string>[] = [];
    const shouldBeUpdated: AnyDict<AnyDict<any>> = {};
    showAdmins.forEach((admins) => {
        if (serverAdmins.includes(admins.id)) {
            if (admins.servers.includes(serverId)) {
                const newServerSets = admins.servers.filter((res) => res !== serverId);
                if (newServerSets.length > 0) {
                    shouldBeUpdated[admins.id] = {
                        mongoId: admins.mongo_id,
                        servers: newServerSets,
                    };
                } else {
                    shouldBeDeleted.push({
                        id: admins.id,
                        mongo_id: admins.mongo_id,
                    });
                }
            }
        }
    });

    for (let i = 0; i < shouldBeDeleted.length; i++) {
        const elemDel = shouldBeDeleted[i];
        await prisma.showtimesadmin.delete({ where: { mongo_id: elemDel.mongo_id } });
        emitSocket("delete admin", elemDel.id);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [adminId, srvList] of Object.entries(shouldBeUpdated)) {
        await prisma.showtimesadmin.update({
            where: { mongo_id: srvList.mongoId },
            data: {
                servers: { set: srvList.servers },
            },
        });
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
        const osrvData = await prisma.showtimesdatas.findFirst({
            where: { id: unlink.id },
            select: { anime: true, mongo_id: true },
        });
        const animeId = _.findIndex(osrvData.anime, (o: Project) => o.id === unlink.animeId);
        if (animeId === -1) return;
        let kolebData = osrvData.anime[animeId].kolaborasi;
        if (kolebData.length < 1) return;
        kolebData = kolebData.filter((o) => o !== serverId);
        if (kolebData.length === 1 && kolebData[0] === unlink.id) {
            kolebData = [];
        }
        await prisma.showtimesdatas.update({
            where: {
                mongo_id: osrvData.mongo_id,
            },
            data: {
                anime: {
                    updateMany: {
                        where: {
                            id: osrvData.anime[animeId].id,
                        },
                        data: {
                            kolaborasi: kolebData,
                        },
                    },
                },
            },
        });
    }

    await prisma.showtimesdatas.delete({ where: { mongo_id: serverData.mongo_id } });
    const uiLoginData = await prisma.showtimesuilogin.findFirst({ where: { id: serverId } });
    if (!isNone(uiLoginData)) {
        await prisma.showtimesuilogin.delete({ where: { mongo_id: uiLoginData.mongo_id } });
    }
    emitSocket("delete server", serverId);
    if (removeRoles.length > 0) {
        emitSocket("delete roles", { id: serverId, roles: removeRoles });
    }
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = getServerUser(req);
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        if (user.privilege === "owner") {
            res.status(501).json({
                message: "Sorry, this API routes is not implemented",
                code: 501,
            });
        } else {
            try {
                await deleteAndUnlinkEverything(user.id);
                await removeServerUser(req);
                res.json({ success: true, message: "sukses" });
            } catch (e) {
                res.json({ success: false, message: `An error occured: ${e.toString()}` });
            }
        }
    }
});
