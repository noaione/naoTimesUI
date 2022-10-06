import { NextApiResponse } from "next";

import withSession, { NextApiRequestWithSession, removeServerUser } from "../../../lib/session";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    await removeServerUser(req);
    res.setHeader("cache-control", "no-store, max-age=0");
    res.json({ loggedIn: false, error: "Success", code: 2000 });
});
