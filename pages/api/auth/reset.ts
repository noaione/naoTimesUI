import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const reqData = await req.body;
    const user = req.session.get<IUserAuth>("user");
    if (!user) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else if (!reqData) {
        res.status(400).json({ message: "Tidak ada body yang diberikan :(", code: 400 });
    } else {
        const oldUserData = await prisma.showtimesuilogin.findFirst({
            where: { id: user.id },
        });
        if (oldUserData.secret !== reqData.old) {
            res.status(400).json({ message: "Password lama salah!", code: 400 });
        } else {
            await prisma.showtimesuilogin.update({
                where: { mongo_id: oldUserData.mongo_id },
                data: {
                    secret: reqData.new,
                },
            });
            res.json({ message: "success", code: 200 });
        }
    }
});
