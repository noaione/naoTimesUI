import { NextApiResponse } from "next";

import withSession, { getServerUser, NextApiRequestWithSession } from "@/lib/session";

import { emitSocketAndWait } from "@/lib/socket";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    if (req.method?.toLowerCase() !== "post") {
        return res.status(405).json({ message: "Method not allowed", code: 405 });
    }
    const user = getServerUser(req);
    if (!user) {
        return res.status(403).json({ message: "Unauthorized", code: 403 });
    }

    if (user.privilege === "owner") {
        return res.status(501).json({
            message: "Sorry, this API routes is not implemented",
            code: 501,
        });
    }

    const { aniid } = req.query;

    try {
        const pendingData = await emitSocketAndWait("collab delete", {
            id: user.id,
            anime_id: aniid,
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
