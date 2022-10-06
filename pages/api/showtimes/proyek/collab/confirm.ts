import { NextApiResponse } from "next";

import withSession, { getServerUser, NextApiRequestWithSession } from "@/lib/session";

import { KonfirmasiData } from "@/types/collab";
import { emitSocketAndWait } from "@/lib/socket";

type KonfirmasiTanpaAnime = Omit<KonfirmasiData, "animeInfo">;

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    if (req.method?.toLowerCase() !== "post") {
        return res.status(405).json({ message: "Method not allowed", code: 405 });
    }
    const user = getServerUser(req);
    if (!user) {
        return res.status(403).json({ message: "Unauthorized", code: 403 });
    }
    const bodyBag = (await req.body) as KonfirmasiTanpaAnime;

    if (user.privilege === "owner") {
        return res.status(501).json({
            message: "Sorry, this API routes is not implemented",
            code: 501,
        });
    }

    try {
        const pendingData = await emitSocketAndWait("collab create", {
            id: bodyBag.id,
            target: bodyBag.serverId,
        });
        res.json({ message: pendingData, success: true });
    } catch (e) {
        let errorMsg = "Terjadi kesalahan internal, mohon tanya administrator!";
        if (e instanceof Error) {
            errorMsg = e.toString().replace("Error: ", "");
        }
        res.status(500).json({
            message: errorMsg,
            code: 500,
            success: false,
        });
    }
});
