import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler, NextApiRequest } from "next";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

import { isNone } from "./utils";

export type IUserAuthMethod = "local" | "discord";

export interface IUserAuth {
    id: string;
    privilege: "owner" | "server";
    name?: string;
    authType: IUserAuthMethod;
}

export interface IUserDiscordMeta {
    id: string;
    name: string;
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

export default function withSession(session: NextApiHandler<any>) {
    return withIronSessionApiRoute(session, {
        password: process.env.TOKEN_SECRET,
        cookieName: "ntwebui/iron/token",
        cookieOptions: {
            // Valid for 72 hours
            maxAge: 3 * 24 * 60 * 60,
        },
    });
}

export function withSessionSsr<
    P extends {
        [key: string]: unknown;
    } = {
        [key: string]: unknown;
    }
>(
    session: (
        context: GetServerSidePropsContext
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
    return withIronSessionSsr(session, {
        password: process.env.TOKEN_SECRET,
        cookieName: "ntwebui/iron/token",
        cookieOptions: {
            maxAge: 3 * 24 * 60 * 60,
        },
    });
}

export function safeUnset(req: NextApiRequest, key: string) {
    try {
        delete req.session[key];
    } catch (e) {}
}

export function getServerUser(req: NextApiRequest) {
    let user = req.session.user;
    if (isNone(user)) {
        return null;
    }
    if (user.authType === "discord") {
        user = req.session.userServer;
        if (isNone(user)) {
            return null;
        }
    }
    return user;
}

export async function removeServerUser(req: NextApiRequest) {
    const user = req.session.user;
    if (isNone(user)) {
        return;
    }
    if (user.authType === "discord") {
        safeUnset(req, "userServer");
    } else {
        safeUnset(req, "user");
    }
    await req.session.save();
}
