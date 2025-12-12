// src/redis-client.js
const { createClient } = require("redis");
const dotenv = require("dotenv");
dotenv.config();

let client;

async function initRedis() {
  if (!client) {
    client = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
      }
    });

    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
  }
  return client;
}

module.exports = { initRedis };
