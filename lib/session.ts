import { GetServerSidePropsContext, NextApiRequest } from "next";
import { Handler, withIronSession } from "next-iron-session";

import type { NextApiRequestCookies } from "next/dist/server/api-utils";
import type { IncomingMessage } from "http";
import { isNone } from "./utils";

interface SessionClass {
    /**
     * Set a data to session key of API Request or getServerSideProps
     * @param name The name of the session to save to request data
     * @param value The value of it
     */
    set<T>(name: string, value: T): void;
    /**
     * Get a data that are saved into session
     * @param name The name of the key
     */
    get<T>(name: string): T;
    /**
     * Unset a key
     * @param name the key to be unset
     */
    unset(name: string): void;
    /**
     * Save the session and set it into cookies
     *
     * This is an asynchronous function
     */
    save(): Promise<void>;
    /**
     * Destroy the cookie, or invalidate it.
     *
     * This is an asynchronous function
     */
    destroy(): Promise<void>;
}

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

interface CustomSession {
    session: SessionClass;
    activeUser?: IUserAuth & { isToken: boolean };
}

export type NextApiRequestWithSession = NextApiRequest & CustomSession;

interface ExtraRouterContext {
    cookies: NextApiRequestCookies;
    session: SessionClass;
    __NEXT_INIT_QUERY?: { [key: string]: string };
}

export interface NextServerSideContextWithSession extends Omit<GetServerSidePropsContext, "req"> {
    req: IncomingMessage & ExtraRouterContext;
}

export default function withSession<Req, Res = any>(session: Handler<Req, Res>) {
    return withIronSession(session, {
        password: process.env.TOKEN_SECRET,
        cookieName: "ntwebui/iron/token",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false,
            // Valid for 48 hours
            maxAge: 2 * 24 * 60 * 60,
        },
    });
}

export function getServerUser(req: NextApiRequestWithSession) {
    let user = req.session.get<IUserAuth>("user");
    if (isNone(user)) {
        return null;
    }
    if (user.authType === "discord") {
        user = req.session.get<IUserAuth>("userServer");
        if (isNone(user)) {
            return null;
        }
    }
    return user;
}
