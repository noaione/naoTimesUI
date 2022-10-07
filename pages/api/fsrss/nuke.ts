import withSession, { getServerUser } from "@/lib/session";
import { emitSocketAndWait } from "@/lib/socket";

export default withSession(async (req, res) => {
    const user = getServerUser(req);
    if (!user) {
        return res.status(403).json({ message: "Unathorized", success: false });
    }
    const reqBody = await req.body;
    if (typeof reqBody.hashId !== "string") {
        return res.status(400).json({ message: "Missing RSS hash ID", success: false });
    }

    try {
        try {
            const result = await emitSocketAndWait("fsrss delete", {
                id: user.id,
                hash: reqBody.hashId,
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
