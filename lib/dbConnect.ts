import mongoose from "mongoose";

const { MONGODB_URI } = process.env;
const isDev = process.env.NODE_ENV === "development";

if (!MONGODB_URI) {
    throw new Error(`Please define MONGODB_URI on your environment table`);
}

if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (global.mongoose.conn) {
        if (
            global.mongoose.conn.connection.readyState === 0 ||
            global.mongoose.conn.connection.readyState === 3
        ) {
            console.info("Connection to MongoDB dropped, trying to reconnect...");
            let joinedDBUrl = MONGODB_URI;
            if (isDev) joinedDBUrl += "_dev";
            console.info(`Connecting to ${joinedDBUrl}`);
            joinedDBUrl += "?authSource=admin";
            const promised = await mongoose.connect(joinedDBUrl);
            global.mongoose.conn = promised;
        }
        return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
        let joinedDBUrl = MONGODB_URI;
        if (isDev) joinedDBUrl += "_dev";
        console.info(`Connecting to ${joinedDBUrl}`);
        joinedDBUrl += "?authSource=admin";
        const promised = await mongoose.connect(joinedDBUrl);
        // @ts-ignore
        global.mongoose.promise = true;
        console.info("Connected!");
        global.mongoose.conn = promised;
    }
    return global.mongoose.conn;
}

export default dbConnect;
