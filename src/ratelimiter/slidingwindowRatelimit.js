// Install ioredis first: npm install ioredis
const Redis = require("ioredis");
const redis = new Redis(); // connect to localhost:6379

// This is the requirement
const limit = 10;          // 10 requests
const windowMs = 60000;    // per minute
const userId = "user123";  // userId

// Sliding window rate limiter
async function allowRequest(userId, limit, windowMs) {

    const key = `rate_limit:${userId}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    // 1️⃣ Remove old timestamps outside the window
    await redis.zremrangebyscore(key, 0, windowStart);

    // 2️⃣ Count number of requests in current window
    const count = await redis.zcard(key);

    // 3️⃣ Allow or block
    if (count < limit) {
        await redis.zadd(key, now, now);  // add current timestamp
        await redis.pexpire(key, windowMs); // optional cleanup
        return true;
    } else {
        return false;
    }
}

// Test: simulate requests every 2 seconds
setInterval(async () => {
    const allowed = await allowRequest(userId, limit, windowMs);
    console.log(`${new Date().toISOString()} -> ${allowed ? "Allowed" : "Blocked"}`);
}, 2000);
