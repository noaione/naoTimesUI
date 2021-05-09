import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
    throw new Error(`Please define MONGODB_URI on your environment table`);
}

if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (global.mongoose.conn) {
        return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            bufferMaxEntries: 0,
            useFindAndModify: false,
            useCreateIndex: true,
        };

        console.info("Connecting to Mongoose...");
        const promised = await mongoose.connect(MONGODB_URI, opts);
        // @ts-ignore
        global.mongoose.promise = true;
        console.info("Connected!");
        global.mongoose.conn = promised;
    }
    return global.mongoose.conn;
}

export default dbConnect;
