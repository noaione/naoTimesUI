import { NextApiResponse } from "next";

import withSession, { getServerUser, NextApiRequestWithSession } from "../../../lib/session";
import { emitSocketAndWait } from "../../../lib/socket";
import { isNone } from "../../../lib/utils";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = getServerUser(req);
    if (!user) {
        return res.status(403).json({ message: "Unathorized", success: false });
    }
    const reqBody = await req.body;
    if (typeof reqBody.id !== "string") {
        return res.status(400).json({ message: "Missing RSS ID/hash", success: false });
    }
    if (isNone(reqBody.changes)) {
        return res.status(400).json({ message: "Missing changes", success: false });
    }

    try {
        try {
            await emitSocketAndWait("fsrss update", {
                id: user.id,
                hash: reqBody.id,
                changes: reqBody.changes,
            });
            res.json({ message: "success", success: true });
        } catch (e) {
            res.status(500).json({ message: e.toString(), success: false });
        }
    } catch (e) {
        console.error(e);
        res.send("an error occured");
    }
});
