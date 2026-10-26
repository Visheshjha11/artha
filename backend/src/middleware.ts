import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import type { Config } from './config.js';
import { HttpError } from './errors.js';
import { sha256 } from './security.js';
import type { JsonStore, Session, User } from './store.js';

export const SESSION_COOKIE = 'artha_session';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      auth?: { user: User; session: Session };
    }
  }
}

export const readCookie = (req: Request, name: string): string | undefined => {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(eq + 1).trim());
    } catch {
      return undefined;
    }
  }
  return undefined;
};

export const publicUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

/** Responses from this API carry credentials or personal data, so never cache them. */
export const apiHeaders: RequestHandler = (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
};

/**
 * Cookies are SameSite=Lax already; this adds a second check that refuses
 * state-changing requests announcing an Origin we do not recognise.
 * Requests without an Origin header (curl, tests, server-to-server) pass.
 */
export const originGuard = (config: Config): RequestHandler => {
  const allowed = new Set(config.clientOrigins);
  return (req, _res, next) => {
    const safe = req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS';
    const origin = req.headers.origin;
    if (!safe && origin && !allowed.has(origin)) {
      return next(new HttpError(403, 'forbidden_origin', 'Requests from this origin are not allowed.'));
    }
    next();
  };
};

/** Resolve the session cookie into `res.locals.auth`; does nothing if absent or invalid. */
export const loadSession =
  (store: JsonStore): RequestHandler =>
  (req, res, next) => {
    const token = readCookie(req, SESSION_COOKIE);
    if (token) {
      const id = sha256(token);
      const found = store.read((d) => {
        const session = d.sessions.find((s) => s.id === id);
        if (!session || Date.parse(session.expiresAt) <= Date.now()) return null;
        const user = d.users.find((u) => u.id === session.userId);
        return user ? { user, session } : null;
      });
      if (found) res.locals.auth = found;
    }
    next();
  };

export const requireAuth: RequestHandler = (_req, res, next) => {
  if (!res.locals.auth) {
    return next(new HttpError(401, 'unauthenticated', 'You need to sign in to do that.'));
  }
  next();
};

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new HttpError(404, 'not_found', 'No such endpoint.'));
};

export const errorHandler: ErrorRequestHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    if (err.retryAfter) res.setHeader('Retry-After', String(err.retryAfter));
    res.status(err.status).json({
      error: { code: err.code, message: err.message, ...(err.fields ? { fields: err.fields } : {}) },
    });
    return;
  }

  // body-parser errors carry a status and a type
  const parserError = err as { type?: string; status?: number };
  if (parserError.type === 'entity.parse.failed') {
    res.status(400).json({ error: { code: 'invalid_json', message: 'Request body is not valid JSON.' } });
    return;
  }
  if (parserError.type === 'entity.too.large') {
    res.status(413).json({ error: { code: 'payload_too_large', message: 'Request body is too large.' } });
    return;
  }

  console.error('[error]', err);
  res.status(500).json({ error: { code: 'internal_error', message: 'Something went wrong on our side.' } });
};
