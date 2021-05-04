import { NextApiRequest, NextApiResponse } from "next";

import { emitSocketAndWait } from "../../lib/socket";

export default async function pingBotAPI(req: NextApiRequest, res: NextApiResponse) {
    try {
        await emitSocketAndWait("ping", "this is a mock data");
        res.status(200).send("OK");
    } catch (e) {
        res.status(500).send(e.toString());
    }
}
