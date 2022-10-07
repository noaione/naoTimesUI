import { emitSocket, emitSocketAndWait } from "@/lib/socket";
import withSession, { getServerUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { isNone } from "@/lib/utils";

async function findOneAndUpdate(serverId: string, channelId: string) {
    const server = await prisma.showtimesdatas.findFirst({
        where: { id: serverId },
        select: { id: true, mongo_id: true },
    });
    if (isNone(server)) {
        return [false, "Gagal mendapatkan server"];
    }
    await prisma.showtimesdatas.update({
        where: { mongo_id: server.mongo_id },
        data: {
            announce_channel: channelId,
        },
    });
}

async function changeChannelId(serverId: string, channelId: string): Promise<[boolean, string, number]> {
    let channelInfo;
    try {
        channelInfo = await emitSocketAndWait("get channel", { id: channelId, server: serverId });
    } catch (e) {
        const errorData: string = e.toString().toLowerCase();
        let msgFucked = "Error tidak diketahui";
        if (errorData.includes("bukanlah angka")) {
            msgFucked = "ID bukanlah angka";
        } else if (errorData.includes("menemukan server")) {
            msgFucked = "Tidak dapat menemukan server";
        } else if (errorData.includes("menemukan channel")) {
            msgFucked = "Tidak dapat menemukan channel tersebut di server anda!";
        } else if (errorData.includes("bukan textchannel")) {
            msgFucked = "Channel bukanlah channel teks (Text Channel)";
        }
        return [false, `Gagal mendapatkan channel: ${msgFucked}`, 4400];
    }

    try {
        await findOneAndUpdate(serverId, channelInfo.id);
    } catch (e) {
        return [false, "Tidak dapat memperbarui informasi server, mohon coba sesaat lagi", 4500];
    }
    emitSocket("pull data", serverId);
    let channelName = channelInfo.name || channelId;
    if (channelName !== channelId) {
        channelName = `#${channelName}`;
    }
    return [true, channelName, 200];
}

async function removeChannelAnnouncer(serverId: string): Promise<[boolean, string, number]> {
    try {
        await findOneAndUpdate(serverId, "");
    } catch (e) {
        return [false, "Tidak dapat memperbarui informasi server, mohon coba sesaat lagi", 4500];
    }
    emitSocket("pull data", serverId);
    return [true, "Terhapus", 200];
}

export default withSession(async (req, res) => {
    const reqData = await req.body;
    const user = getServerUser(req);
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403, success: false });
    } else if (!reqData) {
        res.status(400).json({ message: "Tidak ada body yang diberikan :(", code: 400, success: false });
    } else if (typeof reqData.channelid !== "string") {
        res.status(400).json({ message: "Mohon masukan channel ID", code: 400, success: false });
    } else {
        if (user.privilege === "owner") {
            res.status(501).json({
                message: "Sorry, this API routes is not implemented",
                code: 501,
                success: false,
            });
        } else {
            let result: boolean;
            let msg: string;
            let statCode: number;
            if (reqData.toRemove) {
                [result, msg, statCode] = await removeChannelAnnouncer(user.id);
            } else {
                [result, msg, statCode] = await changeChannelId(user.id, reqData.channelid);
            }
            if (!result) {
                res.status(500).json({
                    message: msg,
                    code: statCode,
                    success: false,
                });
            } else {
                res.status(200).json({
                    message: "success",
                    code: 200,
                    success: true,
                });
            }
        }
    }
});
