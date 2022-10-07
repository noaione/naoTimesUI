import withSession, { getServerUser } from "@/lib/session";
import { emitSocketAndWait } from "@/lib/socket";

export default withSession(async (req, res) => {
    const user = getServerUser(req);
    if (!user) {
        return res.status(403).json({ message: "Unathorized", success: false, results: [], code: 403 });
    }
    try {
        try {
            const textChannels = await emitSocketAndWait("get server channel", {
                id: user.id,
            });
            res.json({ results: textChannels, success: true, message: "Sucesss", code: 200 });
        } catch (e) {
            res.status(500).json({ message: e.toString(), success: false, results: [], code: 4401 });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            results: [],
            message: "An unknown error has occurred on server side",
            code: 500,
            success: false,
        });
    }
});
