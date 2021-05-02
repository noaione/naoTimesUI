import axios from "axios";
import { NextApiResponse } from "next";

import withSession, { NextApiRequestWithSession } from "../../lib/session";
import { emitSocketAndWait } from "../../lib/socket";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const urlParams = new URL(req.query.url as string);

    try {
        const axiosResp = await axios.get(urlParams.toString(), {
            headers: {
                "User-Agent": "naoTimesUI/1.1.0 (+https://github.com/noaione/naoTimesUI)",
            },
            responseType: "text",
        });
        const resp = axiosResp.data;
        const parsedEntries = await emitSocketAndWait("fsrss parse", resp);
        res.json({ results: parsedEntries });
    } catch (e) {
        console.error(e);
        res.send("an error occured");
    }
});