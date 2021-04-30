/// <reference types="next" />
/// <reference types="next/types/global" />

import { Mongoose } from "mongoose";

interface MongooseCached {
    promise?: Promise<Mongoose> | null;
    conn?: Mongoose | null;
}

declare global {
    namespace NodeJS {
        interface Global {
            mongoose?: MongooseCached;
        }

        // Extend process.env typing
        interface ProcessEnv {
            MONGODB_URI?: string;
            TOKEN_SECRET?: string;
            BOT_SOCKET_HOST?: string;
            BOT_SOCKET_PORT?: string;
            BOT_SOCKET_PASSWORD?: string;
        }
    }
}
