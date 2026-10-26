interface Bucket {
  count: number;
  resetAt: number;
}

/** Fixed-window, in-memory limiter. Good enough for a single local process. */
export class RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  /**
   * Count one attempt and return the seconds to wait if the key is now over the limit
   * (0 means allowed). Counting before the work starts keeps parallel requests honest.
   */
  hit(key: string, now = Date.now()): number {
    this.sweep(now);
    const current = this.buckets.get(key);
    const b = current && current.resetAt > now ? current : { count: 0, resetAt: now + this.windowMs };
    b.count += 1;
    this.buckets.set(key, b);
    return b.count > this.max ? Math.ceil((b.resetAt - now) / 1000) : 0;
  }

  reset(key: string): void {
    this.buckets.delete(key);
  }

  private sweep(now: number): void {
    if (this.buckets.size < 5000) return;
    for (const [key, b] of this.buckets) if (b.resetAt <= now) this.buckets.delete(key);
  }
}
