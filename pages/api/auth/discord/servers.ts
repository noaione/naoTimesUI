/**
 * Handle Discord Servers
 */

import { NextApiResponse } from "next";

import withSession, { IUserDiscordMeta, NextApiRequestWithSession } from "@/lib/session";
import { discordGetUserGuilds } from "@/lib/discord-oauth";
import { emitSocketAndWait } from "@/lib/socket";

export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const discordMeta = req.session.get<IUserDiscordMeta>("userDiscordMeta");
    if (!discordMeta) {
        res.status(401).json({ code: 401, error: "Account not logged in as discord!", success: false });
        return;
    }

    const discordServers = await discordGetUserGuilds(discordMeta.access_token);
    if (!discordServers) {
        res.status(401).json({ code: 401, error: "Account not logged in as discord!", success: false });
        return;
    }
    const serverRequest = discordServers.map((server) => {
        return server.id;
    });
    try {
        const requestedValidServer = await emitSocketAndWait("get user privileged", {
            id: discordMeta.id,
            servers: serverRequest,
        });
        res.json({ code: 200, success: true, data: requestedValidServer });
    } catch (e) {
        console.error(e);
        res.status(500).json({ code: 500, error: "Internal server error", success: false });
    }
});
