import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { isNone } from "@/lib/utils";

async function findAndUpdate(userId: string, targetName: string) {
    const uiLogin = await prisma.showtimesuilogin.findFirst({
        where: { id: userId },
        select: { id: true, mongo_id: true },
    });
    if (isNone(uiLogin)) {
        return;
    }
    await prisma.showtimesuilogin.update({
        where: { mongo_id: uiLogin.mongo_id },
        data: {
            name: targetName,
        },
    });
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const reqData = await req.body;
    const user = req.session.get<IUserAuth>("user");
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403, success: false });
    } else if (!reqData) {
        res.status(400).json({ message: "Tidak ada body yang diberikan :(", code: 400, success: false });
    } else if (typeof reqData.newname !== "string") {
        res.status(400).json({ message: "Mohon masukan nama baru", code: 400, success: false });
    } else {
        await findAndUpdate(user.id, reqData.newname);
        const newSession: IUserAuth = {
            id: user.id,
            name: reqData.newname,
            privilege: user.privilege,
        };
        req.session.unset("user");
        req.session.set("user", newSession);
        await req.session.save();
        res.json({ message: "success", code: 200, success: true });
    }
});
