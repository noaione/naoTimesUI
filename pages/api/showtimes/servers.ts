import { NextApiRequest, NextApiResponse } from "next";

import { emitSocketAndWait } from "@/lib/socket";

export default async function fetchShowtimesServers(req: NextApiRequest, res: NextApiResponse) {
    try {
        const results = await emitSocketAndWait("get servers", "can use put any data");
        res.json({ result: results, success: true });
    } catch (e) {
        res.status(500).send({ result: [], message: e.toString(), success: false });
    }
}
