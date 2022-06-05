import { PrismaClient } from "@prisma/client";

interface MongooseCached {
    promise?: Promise<Mongoose> | null;
    conn?: Mongoose | null;
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
        }
    }
}
