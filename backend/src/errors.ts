export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields?: Record<string, string>,
    readonly retryAfter?: number,
  ) {
    super(message);
  }
}

export const tooManyRequests = (retryAfterSeconds: number) =>
  new HttpError(
    429,
    'rate_limited',
    `Too many attempts. Try again in ${Math.max(1, Math.ceil(retryAfterSeconds / 60))} minute(s).`,
    undefined,
    retryAfterSeconds,
  );
