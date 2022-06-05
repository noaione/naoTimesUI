import { NextApiResponse } from "next";

import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import prisma from "@/lib/prisma";

async function getServerExtra(serverId: string) {
    const serverRes = await prisma.showtimesdatas.findFirst({
        where: { id: serverId },
        select: {
            serverowner: true,
            announce_channel: true,
        },
    });
    return serverRes;
}

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const user = req.session.get<IUserAuth>("user");
    if (user) {
        // is signed in, let's get the server info too!
        const extraMetadata = await getServerExtra(user.id);
        res.json({
            success: true,
            code: 200,
            error: "Success",
            data: {
                id: user.id,
                ...extraMetadata,
            },
        });
    } else {
        res.status(401).json({
            success: false,
            code: 401,
            error: "Unauthorized",
            data: null,
        });
    }
});
