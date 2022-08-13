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
    const { code } = req.query;
    if (!code) {
        res.redirect("/discord/failure?error=400");
        return;
    }

    // get base url
    const symbols = Object.getOwnPropertySymbols(req);
    const lastSymbol = symbols[symbols.length - 1];
    const nextMeta = req[lastSymbol];
    let baseUrl = null;
    for (const value of Object.values(nextMeta)) {
        // @ts-ignore
        if (value.startsWith("http")) {
            baseUrl = value;
            break;
        }
    }

    // parse baseUrl
    if (!baseUrl) {
        res.redirect("/discord/failure?error=5002");
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
        res.redirect("/discord/failure?error=5001");
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
    });
    await req.session.save();
    res.redirect("/discord");
});
