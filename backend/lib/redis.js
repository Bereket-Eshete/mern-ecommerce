import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redis = null;

if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_URL !== 'your_redis_url') {
	try {
		redis = new Redis(process.env.UPSTASH_REDIS_URL);
		console.log('Redis connected successfully');
	} catch (error) {
		console.log('Redis connection failed:', error.message);
	}
} else {
	console.log('Redis URL not configured - running without cache');
}

export { redis };
