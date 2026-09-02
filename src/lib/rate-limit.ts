import "server-only";

// Best-effort in-memory rate limiter for public form endpoints (diagnostic,
// mission request, contact). On serverless platforms each warm instance keeps
// its own counters, so this is a first line of defense against casual abuse —
// not a substitute for a shared store (Upstash/Redis) if stricter guarantees
// are needed later.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > limit;
}

export function clientIpFrom(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}
