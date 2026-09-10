import rateLimit from "express-rate-limit";

const json = (res, message) =>
  res.status(429).json({ success: false, message });

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    json(res, "Too many login attempts. Please try again later."),
});

export const commentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    json(res, "Too many comments. Please slow down and try again later."),
});

export const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    json(res, "AI generation limit reached. Please try again later."),
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    json(res, "Too many requests. Please try again later."),
});
