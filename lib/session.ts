import { GetServerSidePropsContext, NextApiRequest } from "next";
import { Handler, withIronSession } from "next-iron-session";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";

import type { IncomingMessage } from "http";

interface SessionClass {
    /**
     * Set a data to session key of API Request or getServerSideProps
     * @param name The name of the session to save to request data
     * @param value The value of it
     */
    set<T extends any>(name: string, value: T): void;
    /**
     * Get a data that are saved into session
     * @param name The name of the key
     */
    get<T extends any>(name: string): T;
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

export interface IUserAuth {
    id: string;
    privilege: "owner" | "server";
    name?: string;
}

export type NextApiRequestWithSession = NextApiRequest & { session: SessionClass };

interface ExtraRouterContext {
    cookies: NextApiRequestCookies;
    session: SessionClass;
    __NEXT_INIT_QUERY?: { [key: string]: string };
}

export interface NextServerSideContextWithSession extends Omit<GetServerSidePropsContext, "req"> {
    req: IncomingMessage & ExtraRouterContext;
}

export default function withSession(session: Handler) {
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
