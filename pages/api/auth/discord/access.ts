/**
 * Discord, get access to the servers.
 */

import prisma from "@/lib/prisma";

import withSession, { IUserAuth } from "@/lib/session";
import { shouldRefreshDiscordTokenOrNot } from "@/lib/discord-oauth";
import { emitSocketAndWait } from "@/lib/socket";
import { isNone } from "@/lib/utils";

interface RequestBody {
    id?: string;
}

interface RequestedServer {
    id: string;
    name: string;
    avatar: string;
}

interface RequestedValidServer {
    r: RequestedServer[];
    u: RequestedServer[];
}

export default withSession(async (req, res) => {
    const reqBody = (await req.body) as RequestBody;
    let discordMeta = req.session.userDiscordMeta;
    if (!discordMeta) {
        res.status(401).json({ code: 401, error: "Account not logged in as discord!", success: false });
        return;
    }
    const guildId = reqBody.id;
    if (isNone(guildId)) {
        res.status(400).json({ code: 400, error: "No guildId provided!", success: false });
        return;
    }

    discordMeta = await shouldRefreshDiscordTokenOrNot(discordMeta);
    req.session.userDiscordMeta = discordMeta;
    await req.session.save();

    try {
        const requestedValidServer = await emitSocketAndWait<RequestedValidServer>("get user privileged", {
            id: discordMeta.id,
            servers: [guildId],
        });
        // find server info in requestedValidServer
        const requestedServer = requestedValidServer.r.findIndex((guild) => guild.id === guildId);
        if (requestedServer === -1) {
            return res.status(401).json({
                code: 401,
                error: "Account is not allowed to access the provided server!",
                success: false,
            });
        }
        // let set the account info to user session.
        const server = requestedValidServer.r[requestedServer];
        const firstUser = await prisma.showtimesuilogin.findFirst({
            where: {
                id: server.id,
            },
        });
        if (isNone(firstUser)) {
            return res.status(401).json({
                code: 401,
                error: "Account is not allowed to access the provided server!",
                success: false,
            });
        }

        const user: IUserAuth = {
            id: server.id,
            privilege: "server",
            name: server.name,
            authType: "discord",
        };
        req.session.userServer = user;
        await req.session.save();
        res.json({ code: 200, success: true, error: "Sukses" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ code: 500, error: "Internal server error", success: false });
    }
});
