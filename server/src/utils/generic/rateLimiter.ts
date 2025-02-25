import { rateLimit } from "express-rate-limit";
import { getEnv } from "./manage-env";

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(getEnv("RATE_LIMIT")),
  standardHeaders: true,
  legacyHeaders: false,
});
