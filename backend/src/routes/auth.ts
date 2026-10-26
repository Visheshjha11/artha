import { randomUUID } from 'node:crypto';
import { Router, type Response } from 'express';
import type { Config } from '../config.js';
import { HttpError, tooManyRequests } from '../errors.js';
import type { Mailer } from '../mailer.js';
import { SESSION_COOKIE, publicUser, readCookie, requireAuth } from '../middleware.js';
import { RateLimiter } from '../rateLimit.js';
import { burnPasswordCheck, hashPassword, newToken, sha256, verifyPassword } from '../security.js';
import type { JsonStore, User } from '../store.js';
import { forgotSchema, parseBody, resetSchema, signinSchema, signupSchema } from '../validation.js';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

interface Deps {
  config: Config;
  store: JsonStore;
  mailer: Mailer;
}

export const createAuthRouter = ({ config, store, mailer }: Deps): Router => {
  const router = Router();

  const windowMs = config.rateLimits.windowMinutes * MINUTE;
  const signinLimiter = new RateLimiter(config.rateLimits.signinAttempts, windowMs);
  const signupLimiter = new RateLimiter(config.rateLimits.signupPerWindow, windowMs);
  const forgotLimiter = new RateLimiter(config.rateLimits.forgotPerWindow, windowMs);
  const resetLimiter = new RateLimiter(config.rateLimits.forgotPerWindow * 2, windowMs);

  const cookieBase = {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.env === 'production',
    path: '/',
  } as const;

  const startSession = async (res: Response, userId: string, remember: boolean) => {
    const token = newToken();
    const ttl = remember ? config.rememberMeDays * DAY : config.sessionHours * HOUR;
    const now = Date.now();
    await store.mutate((d) => {
      d.sessions.push({
        id: sha256(token),
        userId,
        createdAt: new Date(now).toISOString(),
        expiresAt: new Date(now + ttl).toISOString(),
      });
    });
    // "Keep me signed in" gets a persistent cookie; otherwise it ends with the browser session.
    res.cookie(SESSION_COOKIE, token, remember ? { ...cookieBase, maxAge: ttl } : cookieBase);
  };

  const enforce = (limiter: RateLimiter, key: string) => {
    const wait = limiter.hit(key);
    if (wait > 0) throw tooManyRequests(wait);
  };

  const findByEmail = (email: string): User | undefined =>
    store.read((d) => d.users.find((u) => u.email === email));

  router.post('/signup', async (req, res) => {
    enforce(signupLimiter, `ip:${req.ip}`);
    const { name, email, password } = parseBody(signupSchema, req.body);

    const emailTaken = () =>
      new HttpError(409, 'email_taken', 'An account with this email already exists.', {
        email: 'An account with this email already exists.',
      });
    if (findByEmail(email)) throw emailTaken();

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    const user: User = { id: randomUUID(), name, email, passwordHash, createdAt: now, updatedAt: now };

    // Re-check inside the mutation: two simultaneous signups must not both win.
    const created = await store.mutate((d) => {
      if (d.users.some((u) => u.email === email)) return false;
      d.users.push(user);
      return true;
    });
    if (!created) throw emailTaken();

    await startSession(res, user.id, false);
    res.status(201).json({ user: publicUser(user) });
  });

  router.post('/signin', async (req, res) => {
    const { email, password, rememberMe } = parseBody(signinSchema, req.body);

    // Failed attempts are counted per IP + email; a successful sign-in clears the count.
    const key = `${req.ip}|${email}`;
    enforce(signinLimiter, key);

    const user = findByEmail(email);
    let valid = false;
    if (user) {
      valid = await verifyPassword(password, user.passwordHash);
    } else {
      await burnPasswordCheck(password);
    }
    if (!user || !valid) {
      throw new HttpError(401, 'invalid_credentials', 'Invalid email or password.');
    }

    signinLimiter.reset(key);
    await startSession(res, user.id, rememberMe);
    res.json({ user: publicUser(user) });
  });

  router.post('/signout', async (req, res) => {
    const token = readCookie(req, SESSION_COOKIE);
    if (token) {
      const id = sha256(token);
      await store.mutate((d) => {
        d.sessions = d.sessions.filter((s) => s.id !== id);
      });
    }
    res.clearCookie(SESSION_COOKIE, cookieBase);
    res.status(204).end();
  });

  router.get('/me', requireAuth, (_req, res) => {
    res.json({ user: publicUser(res.locals.auth!.user) });
  });

  router.post('/forgot-password', async (req, res) => {
    enforce(forgotLimiter, `ip:${req.ip}`);
    const { email } = parseBody(forgotSchema, req.body);

    const user = findByEmail(email);
    if (user) {
      const token = newToken();
      const expiresAt = new Date(Date.now() + config.resetTokenMinutes * MINUTE).toISOString();
      await store.mutate((d) => {
        // Only the newest link works.
        d.resetTokens = d.resetTokens.filter((t) => t.userId !== user.id || t.usedAt !== null);
        d.resetTokens.push({ id: sha256(token), userId: user.id, expiresAt, usedAt: null });
      });
      const link = `${config.clientOrigins[0]}/#reset-password?token=${token}`;
      await mailer.sendPasswordReset(user.email, link, config.resetTokenMinutes);
    }

    // Same answer whether or not the account exists.
    res.json({ message: 'If an account exists for that email, a reset link has been sent.' });
  });

  router.post('/reset-password', async (req, res) => {
    enforce(resetLimiter, `ip:${req.ip}`);
    const { token, password } = parseBody(resetSchema, req.body);

    const passwordHash = await hashPassword(password);
    const id = sha256(token);
    const now = Date.now();

    const ok = await store.mutate((d) => {
      const record = d.resetTokens.find((t) => t.id === id);
      if (!record || record.usedAt || Date.parse(record.expiresAt) <= now) return false;
      const user = d.users.find((u) => u.id === record.userId);
      if (!user) return false;

      user.passwordHash = passwordHash;
      user.updatedAt = new Date(now).toISOString();
      record.usedAt = new Date(now).toISOString();
      // A reset means the old password may be compromised: sign out everywhere.
      d.sessions = d.sessions.filter((s) => s.userId !== user.id);
      return true;
    });

    if (!ok) {
      throw new HttpError(400, 'invalid_token', 'This reset link is invalid or has expired.');
    }
    res.json({ message: 'Password updated. You can now sign in with your new password.' });
  });

  return router;
};
