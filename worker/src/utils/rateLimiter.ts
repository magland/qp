// Rate limiting utilities using KV

import { Env } from '../types';

// Rate limit configurations
export const RATE_LIMITS = {
  completion: {
    perMinute: 100,
    perHour: 1000,
  },
  chatOps: {
    perMinute: 300,
    perHour: 5000,
  },
};

// Block duration for repeat offenders (24 hours in seconds)
const BLOCK_DURATION = 24 * 60 * 60;

// Hash IP address for privacy
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'qp-salt-2024'); // Simple fixed salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get IP from request
function getClientIP(request: Request): string {
  // Try CF-Connecting-IP header (Cloudflare)
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;
  
  // Fallback to x-forwarded-for
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  
  // Last resort
  return 'unknown';
}

interface RateLimitData {
  minuteBucket: number;
  minuteCount: number;
  hourBucket: number;
  hourCount: number;
  violations: number;
}

export async function checkRateLimit(
  request: Request,
  env: Env,
  limitType: 'completion' | 'chatOps'
): Promise<{ allowed: boolean; retryAfter?: number; reason?: string }> {
  const ip = getClientIP(request);
  const hashedIP = await hashIP(ip);
  const now = Date.now();
  const currentMinute = Math.floor(now / 60000); // Minute bucket
  const currentHour = Math.floor(now / 3600000); // Hour bucket
  
  const key = `ratelimit:${limitType}:${hashedIP}`;
  
  // Check if IP is blocked
  const blockKey = `blocked:${hashedIP}`;
  const blocked = await env.RATE_LIMIT_KV.get(blockKey);
  if (blocked) {
    const blockedUntil = parseInt(blocked, 10);
    if (now < blockedUntil) {
      return {
        allowed: false,
        retryAfter: Math.ceil((blockedUntil - now) / 1000),
        reason: 'IP blocked due to excessive violations',
      };
    } else {
      // Unblock if time has passed
      await env.RATE_LIMIT_KV.delete(blockKey);
    }
  }
  
  // Get current rate limit data
  const dataStr = await env.RATE_LIMIT_KV.get(key);
  const data: RateLimitData = dataStr
    ? JSON.parse(dataStr)
    : { minuteBucket: 0, minuteCount: 0, hourBucket: 0, hourCount: 0, violations: 0 };
  
  // Reset counters if time window changed
  let minuteCount = data.minuteBucket === currentMinute ? data.minuteCount : 0;
  let hourCount = data.hourBucket === currentHour ? data.hourCount : 0;
  
  // Get limits for this type
  const limits = RATE_LIMITS[limitType];
  
  // Check if limits exceeded
  if (minuteCount >= limits.perMinute) {
    const newViolations = data.violations + 1;
    await env.RATE_LIMIT_KV.put(
      key,
      JSON.stringify({ ...data, violations: newViolations }),
      { expirationTtl: 3600 }
    );
    
    // Auto-block if too many violations
    if (newViolations >= 10) {
      const blockedUntil = now + (BLOCK_DURATION * 1000);
      await env.RATE_LIMIT_KV.put(blockKey, blockedUntil.toString(), {
        expirationTtl: BLOCK_DURATION,
      });
    }
    
    return {
      allowed: false,
      retryAfter: 60,
      reason: `Rate limit exceeded: ${limits.perMinute} requests per minute`,
    };
  }
  
  if (hourCount >= limits.perHour) {
    const newViolations = data.violations + 1;
    await env.RATE_LIMIT_KV.put(
      key,
      JSON.stringify({ ...data, violations: newViolations }),
      { expirationTtl: 3600 }
    );
    
    // Auto-block if too many violations
    if (newViolations >= 10) {
      const blockedUntil = now + (BLOCK_DURATION * 1000);
      await env.RATE_LIMIT_KV.put(blockKey, blockedUntil.toString(), {
        expirationTtl: BLOCK_DURATION,
      });
    }
    
    return {
      allowed: false,
      retryAfter: 3600,
      reason: `Rate limit exceeded: ${limits.perHour} requests per hour`,
    };
  }
  
  // Increment counters
  const newData: RateLimitData = {
    minuteBucket: currentMinute,
    minuteCount: minuteCount + 1,
    hourBucket: currentHour,
    hourCount: hourCount + 1,
    violations: data.violations,
  };
  
  await env.RATE_LIMIT_KV.put(key, JSON.stringify(newData), { expirationTtl: 86400 });
  
  return { allowed: true };
}

export function createRateLimitResponse(retryAfter: number, reason: string): Response {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      retryAfter,
      message: reason,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}
