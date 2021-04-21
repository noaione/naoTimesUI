import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
    throw new Error(`Please define MONGODB_URI on your environment table`);
}

// @ts-ignore
let cached = global.mongoose;
if (!cached) {
    // @ts-ignore
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
