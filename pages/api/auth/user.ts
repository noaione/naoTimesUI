import withSession, { getServerUser } from "@/lib/session";
import prisma from "@/lib/prisma";

async function getServerExtra(serverId: string) {
    const serverRes = await prisma.showtimesdatas.findFirst({
        where: {
            id: serverId,
        },
        select: {
            serverowner: true,
            announce_channel: true,
            mongo_id: false,
        },
    });
    return serverRes;
}

export default withSession(async (req, res) => {
    const user = getServerUser(req);
    if (user) {
        // is signed in, let's get the server info too!
        const extraMetadata = await getServerExtra(user.id);
        const joinedData = { ...user, ...extraMetadata };
        res.json({
            loggedIn: true,
            ...joinedData,
        });
    } else {
        res.json({
            loggedIn: false,
        });
    }
});
