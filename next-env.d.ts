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
    }
}
