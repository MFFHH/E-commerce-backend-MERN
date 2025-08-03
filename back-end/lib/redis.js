dotenv.config(); // Load environment variables from .env file
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export const Redis = createClient({
    url: process.env.REDIS_URL,
});
Redis.connect();
