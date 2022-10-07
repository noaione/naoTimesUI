import axios from "axios";

import withSession from "@/lib/session";
import { emitSocketAndWait } from "@/lib/socket";

import packageJSON from "../../package.json";

const APP_VERSION = packageJSON.version;

export default withSession(async (req, res) => {
    const urlParams = new URL(req.query.url as string);

    try {
        const axiosResp = await axios.get(urlParams.toString(), {
            headers: {
                "User-Agent": `naoTimesUI-RSSBot/v${APP_VERSION} (+https://github.com/noaione/naoTimesUI)`,
            },
            responseType: "text",
        });
        const resp = axiosResp.data;
        const parsedEntries = await emitSocketAndWait("fsrss parse", resp);
        res.json({ results: parsedEntries });
    } catch (e) {
        console.error(e);
        if (e.response) {
            res.status(e.status).send(e.statusText);
        } else {
            res.status(500).send(e.toString());
        }
    }
});
