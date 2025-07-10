import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

// Simple in-memory rate limiting (will be replaced with Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limiting middleware
export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const clientId = req.ip || 'unknown';
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
  
  const now = Date.now();
  const clientData = requestCounts.get(clientId);

  // Reset counter if window has passed
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, {
      count: 1,
      resetTime: now + windowMs
    });
    next();
    return;
  }

  // Check if limit exceeded
  if (clientData.count >= maxRequests) {
    const resetTime = new Date(clientData.resetTime).toISOString();
    throw new ApiError(
      `Rate limit exceeded. Try again after ${resetTime}`,
      429
    );
  }

  // Increment counter
  clientData.count++;
  requestCounts.set(clientId, clientData);

  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': (maxRequests - clientData.count).toString(),
    'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
  });

  next();
}; 