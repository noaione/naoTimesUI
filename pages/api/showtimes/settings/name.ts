import { NextApiResponse } from "next";

import dbConnect from "../../../../lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../../lib/session";

import { UserModel } from "../../../../models/user";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const reqData = await req.body;
    const user = req.session.get<IUserAuth>("user");
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else if (!reqData) {
        res.status(400).json({ message: "Tidak ada body yang diberikan :(", code: 400 });
    } else if (typeof reqData.newname !== "string") {
        res.status(400).json({ message: "Mohon masukan nama baru", code: 400 });
    } else {
        await dbConnect();
        await UserModel.updateOne({ id: { $eq: user.id } }, { $set: { name: reqData.newname } });
        const newSession: IUserAuth = {
            id: user.id,
            name: reqData.newname,
            privilege: user.privilege,
        };
        req.session.unset("user");
        req.session.set("user", newSession);
        await req.session.save();
        res.json({ message: "success", code: 200 });
    }
});
