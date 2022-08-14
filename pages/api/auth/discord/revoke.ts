/**
 * Revoke the userServer session thingy
 */

import { NextApiResponse } from "next";

import withSession, { NextApiRequestWithSession } from "@/lib/session";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
        req.session.unset("userServer");
    } catch (e) {}
    await req.session.save();
    res.json({ status: "ok" });
});
