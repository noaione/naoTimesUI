/**
 * Handle Discord OAuth2 callback
 */

import { NextApiResponse } from "next";

import { DateTime } from "luxon";
import withSession, { IUserAuth, NextApiRequestWithSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { isNone } from "@/lib/utils";
import { discordGetUser, DiscordToken, exchangeDiscordToken } from "@/lib/discord-oauth";

function pickFirstOne<T>(data: T | T[]): T {
    if (Array.isArray(data)) {
        return data[0];
    }
    return data;
}

// TODO: implement click jacking prevention
export default withSession(async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const { code, base_url } = req.query;
    if (!code) {
        res.status(400).json({ error: "Tidak ada kode yang diberikan!" });
        return;
    }
    if (!base_url) {
        res.status(400).json({ error: "Tidak ada base url yang diberikan!" });
        return;
    }

    // nextjs, get the base url used when requesting this url
    const baseUrl = decodeURIComponent(pickFirstOne(base_url));

    // parse baseUrl
    if (!baseUrl) {
        res.status(400).json({ error: "Tidak ada base url yang diberikan!" });
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [httpBase, , host, _] = baseUrl.split("/");

    const actualBaseUrl = `${httpBase}//${host}`;

    let discordToken: DiscordToken;
    try {
        discordToken = await exchangeDiscordToken(pickFirstOne(code), actualBaseUrl);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Tidak dapat mendapatkan token dari Discord!" });
        return;
    }

    const userInfo = await discordGetUser(discordToken.access_token);

    const firstUser = await prisma.showtimesuilogin.findFirst({
        where: {
            id: userInfo.id,
        },
    });
    const currentUtc = DateTime.utc().toUnixInteger();
    const expiresAt = currentUtc + discordToken.expires_in;
    if (isNone(firstUser)) {
        // create user in db
        await prisma.showtimesuilogin.create({
            data: {
                id: userInfo.id,
                name: userInfo.username,
                privilege: "server",
                secret: "notset",
                user_type: "DISCORD",
                discord_meta: {
                    id: userInfo.id,
                    name: userInfo.username,
                    access_token: discordToken.access_token,
                    refresh_token: discordToken.refresh_token,
                    expires_at: expiresAt,
                },
            },
        });
    } else {
        // update user in db
        await prisma.showtimesuilogin.update({
            where: {
                mongo_id: firstUser.mongo_id,
            },
            data: {
                name: userInfo.username,
                discord_meta: {
                    set: {
                        id: userInfo.id,
                        name: userInfo.username,
                        access_token: discordToken.access_token,
                        refresh_token: discordToken.refresh_token,
                        expires_at: expiresAt,
                    },
                },
            },
        });
    }

    const userAuth: IUserAuth = {
        id: userInfo.id,
        privilege: "server",
        name: userInfo.username,
        authType: "discord",
    };
    req.session.set("user", userAuth);
    req.session.set("userDiscordMeta", {
        id: userInfo.id,
        name: userInfo.username,
        access_token: discordToken.access_token,
        refresh_token: discordToken.refresh_token,
        expires_at: expiresAt,
    });
    await req.session.save();
    res.json({ error: "Sukses" });
});
