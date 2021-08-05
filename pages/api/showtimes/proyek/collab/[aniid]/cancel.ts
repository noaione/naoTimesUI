import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import { NextApiResponse } from "next";

import { ShowtimesModel, ShowtimesProps } from "@/models/show";
import { emitSocketAndWait } from "@/lib/socket";
import dbConnect from "@/lib/dbConnect";

async function removeConfirmationCode(serverData: ShowtimesProps, animeId: string): Promise<boolean> {
    if (serverData.konfirmasi.length < 1) {
        return false;
    }

    const leftOver = serverData.konfirmasi.filter((o) => o.anime_id !== animeId);
    serverData.konfirmasi = leftOver;
    console.info(leftOver);

    // @ts-ignore
    await ShowtimesModel.updateOne({ id: serverData.id }, { konfirmasi: leftOver });
    await emitSocketAndWait("pull data", serverData.id);
    return true;
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    if (req.method?.toLowerCase() !== "post") {
        return res.status(405).json({ message: "Method not allowed", code: 405 });
    }
    const user = req.session.get<IUserAuth>("user");
    if (!user) {
        return res.status(403).json({ message: "Unauthorized", code: 403 });
    }

    if (user.privilege === "owner") {
        return res.status(501).json({
            message: "Sorry, this API routes is not implemented",
            code: 501,
        });
    }

    // remove from existence!
    const { aniid } = req.query;
    await dbConnect();

    try {
        const fetchedServers = await ShowtimesModel.findOne(
            { id: { $eq: user.id }, "konfirmasi.anime_id": aniid },
            { id: 1, name: 1, konfirmasi: 1 }
        );
        const success = await removeConfirmationCode(fetchedServers, aniid as string);
        if (success) {
            res.json({ success: true, code: 200 });
        } else {
            res.status(500).json({
                success: true,
                code: 500,
                message: "Terjadi kesalahan ketika menghubungi database, mohon coba lagi nanti!",
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Terjadi kesalahan ketika memproses request anda...",
            code: 500,
            success: false,
        });
    }
});
