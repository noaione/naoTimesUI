import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../lib/session";
import { emitSocketAndWait } from "../../../lib/socket";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
    if (!user) {
        return res.status(403).json({ message: "Unathorized", success: false });
    }
    try {
        try {
            const textChannels = await emitSocketAndWait("get server channel", {
                id: user.id,
            });
            res.json({ results: textChannels, success: true });
        } catch (e) {
            res.status(500).json({ message: e.toString(), success: false });
        }
    } catch (e) {
        console.error(e);
        res.json({ results: [] });
    }
});
