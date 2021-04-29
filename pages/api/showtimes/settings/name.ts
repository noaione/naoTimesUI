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
        console.info(reqData);
        console.info("connecting to database...");
        await dbConnect();
        console.info("updating...");
        await UserModel.updateOne({ id: { $eq: user.id } }, { $set: { name: reqData.newname } });
        user.name = reqData.name;
        const newSession: IUserAuth = {
            id: user.id,
            name: reqData.name,
            privilege: user.privilege,
        };
        console.info("updating session...");
        req.session.unset("user");
        req.session.set("user", newSession);
        console.info("updating save data....");
        await req.session.save();
        console.info("returning");
        res.json({ message: "success", code: 200 });
    }
});
