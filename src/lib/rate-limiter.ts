import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, '10s'),
    prefix: '@upstash/ratelimit'
})