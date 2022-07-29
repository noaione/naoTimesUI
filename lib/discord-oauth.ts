import axios from "axios";

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

export async function exchangeDiscordToken(code: string, redirectBase: string) {
    // create a request for the token
    if (redirectBase.endsWith("/")) {
        redirectBase = redirectBase.slice(0, -1);
    }
    const tokenRequest = await axios.post<DiscordToken>(
        `${BASE_URL}/oauth2/token`,
        new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            redirect_uri: `${redirectBase}/api/auth/discord/callback`,
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

export async function discordGetUser(token: string) {
    const userRequest = await axios.get<DiscordUser>(`${BASE_URL}/users/@me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: "json",
    });
    return userRequest.data;
}
