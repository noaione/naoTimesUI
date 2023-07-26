import { PrismaClient } from "@prisma/client";
import type { IUserAuth, IUserDiscordMeta } from "./lib/session";

interface MongooseCached {
    promise?: Promise<Mongoose> | null;
    conn?: Mongoose | null;
}

declare module "iron-session" {
    interface IronSessionData {
        user?: IUserAuth;
        userServer?: IUserAuth;
        userDiscordMeta?: IUserDiscordMeta;
    }
}

declare global {
    namespace NodeJS {
        interface Global {
            prisma?: PrismaClient;
            portalNumber?: number;
        }

        // Extend process.env typing
        interface ProcessEnv {
            MONGODB_URI?: string;
            TOKEN_SECRET?: string;
            BOT_SOCKET_HOST?: string;
            BOT_SOCKET_PORT?: string;
            BOT_SOCKET_PASSWORD?: string;
            PLAUSIBLE_DOMAIN_TRACK?: string;
            DISCORD_CLIENT_ID?: string;
            DISCORD_CLIENT_SECRET?: string;
            NEXT_PUBLIC_API_V2_ENDPOINT?: string;
            NEXT_PUBLIC_MEILI_API?: string;
            NEXT_PUBLIC_MEILI_KEY?: string;
            MEILI_API?: string;
            MEILI_KEY?: string;
        }
    }
}
