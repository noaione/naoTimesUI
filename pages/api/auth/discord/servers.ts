/**
 * Handle Discord Servers
 */

import withSession from "@/lib/session";
import { discordGetUserGuilds, shouldRefreshDiscordTokenOrNot } from "@/lib/discord-oauth";
import { emitSocketAndWait } from "@/lib/socket";

export default withSession(async (req, res) => {
    let discordMeta = req.session.userDiscordMeta;
    if (!discordMeta) {
        res.status(401).json({ code: 401, error: "Account not logged in as discord!", success: false });
        return;
    }

    discordMeta = await shouldRefreshDiscordTokenOrNot(discordMeta);
    req.session.userDiscordMeta = discordMeta;
    await req.session.save();

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
