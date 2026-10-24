import { Redis } from "ioredis";
import config from "./config.js";

const redis = new Redis({
  host: config.redis_host,
  port: config.redis_port,
  password: config.redis_password,
  maxRetriesPerRequest: 3,
  retryStrategy: (attempt) => Math.min(attempt * 200, 3000), // exponential backoff capped at 3 seconds
});

redis.on("connect", () => {
  console.log("Redis: connecting");
});

redis.on("ready", () => {
  console.log("Redis: connected");
});

redis.on("reconnecting", (ms) => {
  console.log(`Redis: reconnecting in ${ms}ms`);
});

redis.on("close", () => {
  console.log("Redis: connection closed");
});

redis.on("error", (error) => {
  console.log("Redis: connection error", error.message);
});

export default redis;
