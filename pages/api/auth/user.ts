import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../lib/session";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
    if (user) {
        res.json({
            loggedIn: true,
            ...user,
        });
    } else {
        res.json({
            loggedIn: false,
        });
    }
});
