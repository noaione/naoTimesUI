import axios from "axios";
import { DateTime } from "luxon";
import { IUserDiscordMeta } from "./session";
import prisma from "./prisma";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const BASE_URL = "https://discord.com/api/v10";

export interface DiscordToken {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

export interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    bot: boolean;
    mfa_enabled: boolean;
    locale: string;
    verified: boolean;
    email: string;
    flags: number;
    premium_type: number;
    public_flags: number;
}

export interface DiscordPartialGuild {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
}

export async function exchangeDiscordToken(code: string, redirectBase: string) {
    // create a request for the token
    if (redirectBase.endsWith("/")) {
        redirectBase = redirectBase.slice(0, -1);
    }
    const tokenRequest = await axios.post<DiscordToken>(
        `${BASE_URL}/oauth2/token`,
        new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: `${redirectBase}/discord/callback`,
        }).toString(),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    return tokenRequest.data;
}

export async function refreshDiscordToken(refreshToken: string) {
    // create a request for the token
    const tokenRequest = await axios.post<DiscordToken>(
        `${BASE_URL}/oauth2/token`,
        new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            responseType: "json",
        }
    );
    return tokenRequest.data;
}

async function updateTokenOnDatabase(tokenMeta: IUserDiscordMeta) {
    const firstUser = await prisma.showtimesuilogin.findFirst({
        where: {
            id: tokenMeta.id,
        },
    });
    await prisma.showtimesuilogin.update({
        where: {
            mongo_id: firstUser.mongo_id,
        },
        data: {
            name: tokenMeta.name,
            discord_meta: {
                set: {
                    id: tokenMeta.id,
                    name: tokenMeta.name,
                    access_token: tokenMeta.access_token,
                    refresh_token: tokenMeta.refresh_token,
                    expires_at: tokenMeta.expires_at,
                },
            },
        },
    });
}

export async function shouldRefreshDiscordTokenOrNot(
    discordMeta: IUserDiscordMeta
): Promise<IUserDiscordMeta> {
    const currentUtc = DateTime.utc().toUnixInteger();
    if (currentUtc > discordMeta.expires_at) {
        console.warn("[discord-oauth] Token is expired, refreshing...");
        const newToken = await refreshDiscordToken(discordMeta.refresh_token);
        const tokenMetaNew = {
            id: discordMeta.id,
            name: discordMeta.name,
            access_token: newToken.access_token,
            refresh_token: newToken.refresh_token,
            expires_at: currentUtc + newToken.expires_in,
        };
        await updateTokenOnDatabase(tokenMetaNew);
        return tokenMetaNew;
    }
    return discordMeta;
}

export async function discordGetUser(token: string) {
    const userRequest = await axios.get<DiscordUser>(`${BASE_URL}/users/@me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: "json",
    });
    return userRequest.data;
}

export async function discordGetUserGuilds(token: string) {
    const guildRequest = await axios.get<DiscordPartialGuild[]>(`${BASE_URL}/users/@me/guilds`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: "json",
    });
    return guildRequest.data;
}
