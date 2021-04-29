import { NextApiResponse } from "next";

import dbConnect from "../../../lib/dbConnect";
import withSession, { IUserAuth, NextApiRequestWithSession } from "../../../lib/session";

import { UserModel, UserProps } from "../../../models/user";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const reqData = await req.body;
    const user = req.session.get<IUserAuth>("user");
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else if (!reqData) {
        res.status(400).json({ message: "Tidak ada body yang diberikan :(", code: 400 });
    } else {
        await dbConnect();
        const oldUserData = (await UserModel.findOne({ id: { $eq: user.id } })) as UserProps;
        if (oldUserData.secret === reqData.old) {
            res.status(400).json({ message: "Password lama salah!", code: 400 });
        } else {
            await UserModel.updateOne({ id: { $eq: user.id } }, { $set: { secret: reqData.new } });
            res.json({ message: "success", code: 200 });
        }
    }
});
