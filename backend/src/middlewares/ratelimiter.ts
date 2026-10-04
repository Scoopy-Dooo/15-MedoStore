import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'تجاوزت الحد', statusCode: 429 }
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'محاولات كثيرة', statusCode: 429 },
  skipSuccessfulRequests: true
});
