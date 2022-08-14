import { has } from "lodash";
import { NextApiResponse } from "next";

import withSession, { getServerUser, NextApiRequestWithSession } from "../../../lib/session";
import { emitSocketAndWait } from "../../../lib/socket";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = getServerUser(req);
    if (!user) {
        return res.status(403).json({ message: "Unathorized", success: false });
    }
    const reqBody = await req.body;
    if (typeof reqBody.channel !== "string") {
        return res.status(400).json({ message: "Missing channel ID", success: false });
    }
    if (typeof reqBody.url !== "string") {
        return res.status(400).json({ message: "Missing feed URL", success: false });
    }

    let collectedURL = [];
    const sampleURL = reqBody.sample;
    if (Array.isArray(sampleURL)) {
        const URLHasLink = sampleURL.filter((e) => has(e, "link"));
        collectedURL = URLHasLink.map((r) => r.link);
    }

    try {
        try {
            const result = await emitSocketAndWait("fsrss create", {
                id: user.id,
                channel: reqBody.channel,
                url: reqBody.url,
                sample: collectedURL,
            });
            res.json({ id: result.id, success: true });
        } catch (e) {
            res.status(500).json({ message: e.toString(), success: false });
        }
    } catch (e) {
        console.error(e);
        res.send("an error occured");
    }
});
