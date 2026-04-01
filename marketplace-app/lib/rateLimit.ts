type Bucket = { count: number; resetAt: number };

const globalForRateLimit = globalThis as unknown as {
  __connectiaRateLimit?: Map<string, Bucket>;
};

function store(): Map<string, Bucket> {
  if (!globalForRateLimit.__connectiaRateLimit) {
    globalForRateLimit.__connectiaRateLimit = new Map();
  }
  return globalForRateLimit.__connectiaRateLimit;
}

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): { ok: true; remaining: number; resetAt: number } | { ok: false; retryAfterSeconds: number; resetAt: number } {
  const s = store();
  const now = Date.now();
  const existing = s.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + options.windowMs;
    s.set(key, { count: 1, resetAt });
    return { ok: true, remaining: Math.max(0, options.limit - 1), resetAt };
  }

  if (existing.count >= options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { ok: false, retryAfterSeconds, resetAt: existing.resetAt };
  }

  existing.count += 1;
  s.set(key, existing);
  return { ok: true, remaining: Math.max(0, options.limit - existing.count), resetAt: existing.resetAt };
}

