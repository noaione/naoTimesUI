/**
 * Revoke the userServer session thingy
 */

import withSession, { safeUnset } from "@/lib/session";

export default withSession(async (req, res) => {
    try {
        safeUnset(req, "userServer");
    } catch (e) {}
    await req.session.save();
    res.json({ status: "ok" });
});
