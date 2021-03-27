import Redis from "ioredis";

export default function createRedisClient() {
    const HOST = process.env.REDIS_HOST;
    const PORT = process.env.REDIS_PORT;
    const PASS = process.env.REDIS_PASSWORD;
    if (!HOST || !PORT) {
        throw new Error(`createRedisClient: Invalid configuration for RedisDB\nClient: ${HOST}:${PORT}`);
    }
    const PORTNUM = parseInt(PORT);
    if (isNaN(PORTNUM)) {
        throw new Error(`createRedisClient: Port is not a number`);
    }
    if (PASS) {
        return new Redis(PORTNUM, HOST, { password: PASS });
    } else {
        return new Redis(PORTNUM, HOST);
    }
}
