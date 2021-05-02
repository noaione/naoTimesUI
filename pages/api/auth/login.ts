import { NextApiResponse } from "next";

import dbConnect from "../../../lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../lib/session";

import { UserModel } from "../../../models/user";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const { server, password } = await req.body;

    try {
        await dbConnect();
        const findUser = await UserModel.find({ id: { $eq: server } });
        if (findUser.length > 0) {
            const firstUser = findUser[0];
            if (firstUser.id === server && firstUser.secret === password) {
                const { id, privilege, name } = firstUser;
                const user: IUserAuth = { id, privilege, name };
                req.session.set("user", user);
                await req.session.save();
                res.json({ loggedIn: true, id, privilege, name });
            } else {
                res.status(401).json({ error: "Password salah" });
            }
        } else {
            res.status(401).json({ error: "Tidak dapat menemukan ID tersebut!" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Terjadi kesalahan internal, mohon coba lagi!" });
    }
});
