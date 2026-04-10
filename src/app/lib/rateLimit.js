const globalStore = globalThis;

if (!globalStore.__angelxRateLimitStore) {
  globalStore.__angelxRateLimitStore = new Map();
}

const rateLimitStore = globalStore.__angelxRateLimitStore;

export function getClientIdentifier(req, fallback = "unknown") {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || fallback;
}

export function checkRateLimit(key, options) {
  const { windowMs, max } = options;
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + windowMs };
    rateLimitStore.set(key, fresh);
    return { allowed: true, retryAfter: Math.ceil(windowMs / 1000) };
  }

  if (current.count >= max) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return {
    allowed: true,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export function createRateLimitResponse(result, message) {
  return new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(result.retryAfter),
    },
  });
}