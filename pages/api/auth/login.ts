import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { isNone } from "@/lib/utils";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const { server, password } = await req.body;

    try {
        const firstUser = await prisma.showtimesuilogin.findFirst({
            where: {
                id: server,
            },
        });
        if (!isNone(firstUser)) {
            if (firstUser.id === server && firstUser.secret === password) {
                const { id, privilege, name } = firstUser;
                const user: IUserAuth = {
                    id,
                    privilege: privilege as "owner" | "server",
                    name,
                    authType: "local",
                };
                req.session.set("user", user);
                await req.session.save();
                res.json({ loggedIn: true, id, privilege, name, code: 2000, error: "Sukses" });
            } else {
                res.status(401).json({ error: "Password salah", loggedIn: false, code: 4001 });
            }
        } else {
            res.status(401).json({
                error: "Tidak dapat menemukan ID tersebut!",
                loggedIn: false,
                code: 4002,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Terjadi kesalahan internal, mohon coba lagi!",
            loggedIn: false,
            code: 5000,
        });
    }
});
