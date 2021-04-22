import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
    throw new Error(`Please define MONGODB_URI on your environment table`);
}

// @ts-ignore
if (!global.mongoose) {
    // @ts-ignore
    global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    // @ts-ignore
    if (global.mongoose.conn) {
        // @ts-ignore
        return global.mongoose.conn;
    }

    // @ts-ignore
    if (!global.mongoose.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            bufferMaxEntries: 0,
            useFindAndModify: false,
            useCreateIndex: true,
        };

        // @ts-ignore
        global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    // @ts-ignore
    global.mongoose.conn = await global.mongoose.promise;
    // @ts-ignore
    return global.mongoose.conn;
}

export default dbConnect;
