import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
    throw new Error(`Please define MONGODB_URI on your environment table`);
}

if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}

const DEFAULT_OPTS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

async function dbConnect() {
    if (global.mongoose.conn) {
        if (
            global.mongoose.conn.connection.readyState === 0 ||
            global.mongoose.conn.connection.readyState === 3
        ) {
            console.info("Connection to MongoDB dropped, trying to reconnect...");
            const promised = await mongoose.connect(MONGODB_URI, DEFAULT_OPTS);
            global.mongoose.conn = promised;
        }
        return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
        console.info("Connecting to Mongoose...");
        const promised = await mongoose.connect(MONGODB_URI, DEFAULT_OPTS);
        // @ts-ignore
        global.mongoose.promise = true;
        console.info("Connected!");
        global.mongoose.conn = promised;
    }
    return global.mongoose.conn;
}

export default dbConnect;
