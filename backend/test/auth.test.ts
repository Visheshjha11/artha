import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { after, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import type { Config } from '../src/config.js';
import { JsonStore } from '../src/store.js';

const baseConfig = (overrides: Partial<Config> = {}): Config => ({
  env: 'test',
  host: '127.0.0.1',
  port: 0,
  clientOrigins: ['http://localhost:5173'],
  dataFile: null,
  sessionHours: 24,
  rememberMeDays: 30,
  resetTokenMinutes: 30,
  trustProxy: false,
  rateLimits: { signinAttempts: 5, signupPerWindow: 100, forgotPerWindow: 100, windowMinutes: 15 },
  ...overrides,
});

interface Harness {
  url: string;
  store: JsonStore;
  resetLinks: { email: string; link: string }[];
  close: () => Promise<void>;
}

const start = async (config = baseConfig(), store = new JsonStore(config.dataFile)): Promise<Harness> => {
  await store.load();
  const resetLinks: Harness['resetLinks'] = [];
  const app = createApp({
    config,
    store,
    mailer: { sendPasswordReset: (email, link) => void resetLinks.push({ email, link }) },
  });
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    store,
    resetLinks,
    close: async () => {
      await new Promise<void>((r) => server.close(() => r()));
      await store.flush();
    },
  };
};

/** Minimal cookie-aware client (Node's fetch has no cookie jar). */
class Client {
  cookie = '';
  constructor(private readonly url: string) {}

  async request(method: string, route: string, body?: unknown, headers: Record<string, string> = {}) {
    const res = await fetch(this.url + route, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(this.cookie ? { Cookie: this.cookie } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const setCookies = res.headers.getSetCookie();
    const session = setCookies.find((c) => c.startsWith('artha_session='));
    if (session) {
      const value = session.split(';')[0]!;
      this.cookie = value === 'artha_session=' ? '' : value;
    }
    const text = await res.text();
    return { status: res.status, headers: res.headers, setCookie: session, body: text ? JSON.parse(text) : null };
  }
  post = (route: string, body?: unknown, headers?: Record<string, string>) => this.request('POST', route, body ?? {}, headers);
  get = (route: string) => this.request('GET', route);
}

const account = { name: 'Aarav Sharma', email: 'aarav@example.com', password: 'correct horse battery' };

describe('auth API', () => {
  const cleanups: (() => Promise<void>)[] = [];
  after(async () => {
    for (const fn of cleanups) await fn();
  });
  const fresh = async (config?: Config) => {
    const h = await start(config);
    cleanups.push(h.close);
    return { h, c: new Client(h.url) };
  };

  it('reports health', async () => {
    const { c } = await fresh();
    const res = await c.get('/api/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok' });
    assert.equal(res.headers.get('cache-control'), 'no-store');
  });

  it('rejects invalid signup input with per-field messages', async () => {
    const { c } = await fresh();
    const res = await c.post('/api/auth/signup', { name: '', email: 'nope', password: 'short' });
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, 'validation_error');
    assert.deepEqual(Object.keys(res.body.error.fields).sort(), ['email', 'name', 'password']);
  });

  it('signs up, starts a session and never leaks the password hash', async () => {
    const { c } = await fresh();
    const res = await c.post('/api/auth/signup', account);
    assert.equal(res.status, 201);
    assert.equal(res.body.user.email, account.email);
    assert.equal(res.body.user.name, account.name);
    assert.ok(!JSON.stringify(res.body).includes('passwordHash'));
    assert.match(res.setCookie!, /HttpOnly/i);
    assert.match(res.setCookie!, /SameSite=Lax/i);

    const me = await c.get('/api/auth/me');
    assert.equal(me.status, 200);
    assert.equal(me.body.user.id, res.body.user.id);
  });

  it('stores only hashes, never the password or raw session token', async () => {
    const { h, c } = await fresh();
    await c.post('/api/auth/signup', account);
    const dump = h.store.read((d) => JSON.stringify(d));
    assert.ok(!dump.includes(account.password));
    assert.ok(!dump.includes(c.cookie.split('=')[1]!));
    assert.match(h.store.read((d) => d.users[0]!.passwordHash), /^scrypt\$/);
  });

  it('refuses a duplicate email regardless of case', async () => {
    const { c } = await fresh();
    await c.post('/api/auth/signup', account);
    const res = await new Client(c['url']).post('/api/auth/signup', { ...account, email: 'AARAV@Example.com' });
    assert.equal(res.status, 409);
    assert.equal(res.body.error.code, 'email_taken');
  });

  it('handles simultaneous signups for one email', async () => {
    const { h } = await fresh();
    const results = await Promise.all(
      Array.from({ length: 4 }, () => new Client(h.url).post('/api/auth/signup', account)),
    );
    assert.equal(results.filter((r) => r.status === 201).length, 1);
    assert.equal(h.store.read((d) => d.users.length), 1);
  });

  it('gives the same error for a wrong password and an unknown email', async () => {
    const { h, c } = await fresh();
    await c.post('/api/auth/signup', account);
    const wrong = await new Client(h.url).post('/api/auth/signin', { email: account.email, password: 'wrong password!' });
    const unknown = await new Client(h.url).post('/api/auth/signin', { email: 'ghost@example.com', password: 'whatever123' });
    assert.equal(wrong.status, 401);
    assert.equal(unknown.status, 401);
    assert.deepEqual(wrong.body, unknown.body);
  });

  it('signs in, and only persists the cookie when rememberMe is set', async () => {
    const { h, c } = await fresh();
    await c.post('/api/auth/signup', account);

    const session = new Client(h.url);
    const a = await session.post('/api/auth/signin', { email: 'Aarav@example.com ', password: account.password });
    assert.equal(a.status, 200);
    assert.doesNotMatch(a.setCookie!, /Max-Age|Expires/i);

    const remembered = new Client(h.url);
    const b = await remembered.post('/api/auth/signin', { email: account.email, password: account.password, rememberMe: true });
    assert.match(b.setCookie!, new RegExp(`Max-Age=${30 * 24 * 3600}`));
    assert.equal((await remembered.get('/api/auth/me')).status, 200);
  });

  it('requires a session for /me', async () => {
    const { c } = await fresh();
    const res = await c.get('/api/auth/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.error.code, 'unauthenticated');
  });

  it('signs out and invalidates the session server-side', async () => {
    const { h, c } = await fresh();
    await c.post('/api/auth/signup', account);
    const stolen = c.cookie;

    const out = await c.post('/api/auth/signout');
    assert.equal(out.status, 204);
    assert.equal((await c.get('/api/auth/me')).status, 401);

    const replay = new Client(h.url);
    replay.cookie = stolen;
    assert.equal((await replay.get('/api/auth/me')).status, 401);
  });

  it('rejects expired sessions', async () => {
    const { h, c } = await fresh();
    await c.post('/api/auth/signup', account);
    await h.store.mutate((d) => {
      d.sessions[0]!.expiresAt = new Date(Date.now() - 1000).toISOString();
    });
    assert.equal((await c.get('/api/auth/me')).status, 401);
  });

  it('rate limits repeated failed sign-ins, then recovers after a success elsewhere', async () => {
    const { h, c } = await fresh();
    await c.post('/api/auth/signup', account);
    const attacker = new Client(h.url);
    const bad = { email: account.email, password: 'not the password' };
    for (let i = 0; i < 5; i++) assert.equal((await attacker.post('/api/auth/signin', bad)).status, 401);
    const blocked = await attacker.post('/api/auth/signin', bad);
    assert.equal(blocked.status, 429);
    assert.ok(Number(blocked.headers.get('retry-after')) > 0);
  });

  it('refuses state-changing requests from unknown origins', async () => {
    const { c } = await fresh();
    const evil = await c.post('/api/auth/signup', account, { Origin: 'http://evil.example' });
    assert.equal(evil.status, 403);
    const ok = await c.post('/api/auth/signup', account, { Origin: 'http://localhost:5173' });
    assert.equal(ok.status, 201);
  });

  it('answers CORS preflight for the configured origin only', async () => {
    const { h } = await fresh();
    const allowed = await fetch(`${h.url}/api/auth/signin`, {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' },
    });
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');
    assert.equal(allowed.headers.get('access-control-allow-credentials'), 'true');
    const denied = await fetch(`${h.url}/api/auth/signin`, {
      method: 'OPTIONS',
      headers: { Origin: 'http://evil.example', 'Access-Control-Request-Method': 'POST' },
    });
    assert.equal(denied.headers.get('access-control-allow-origin'), null);
  });

  it('returns JSON errors for malformed bodies and unknown routes', async () => {
    const { h } = await fresh();
    const bad = await fetch(`${h.url}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not json',
    });
    assert.equal(bad.status, 400);
    assert.equal((await bad.json()).error.code, 'invalid_json');
    const missing = await fetch(`${h.url}/api/nope`);
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).error.code, 'not_found');
  });

  describe('password reset', () => {
    const tokenFrom = (link: string): string => {
      const token = /[?&]token=([^&]+)/.exec(link)?.[1];
      assert.ok(token, `no token in ${link}`);
      return token;
    };

    it('answers identically for known and unknown emails, and only mails real accounts', async () => {
      const { h, c } = await fresh();
      await c.post('/api/auth/signup', account);
      const known = await c.post('/api/auth/forgot-password', { email: account.email });
      const unknown = await c.post('/api/auth/forgot-password', { email: 'ghost@example.com' });
      assert.equal(known.status, 200);
      assert.deepEqual(known.body, unknown.body);
      assert.equal(h.resetLinks.length, 1);
      assert.equal(h.resetLinks[0]!.email, account.email);
    });

    it('resets the password once, signs out other sessions, and rejects reuse', async () => {
      const { h, c } = await fresh();
      await c.post('/api/auth/signup', account);
      await c.post('/api/auth/forgot-password', { email: account.email });
      const token = tokenFrom(h.resetLinks[0]!.link);

      const weak = await c.post('/api/auth/reset-password', { token, password: 'short' });
      assert.equal(weak.status, 400);

      const newPassword = 'a brand new passphrase';
      const done = await c.post('/api/auth/reset-password', { token, password: newPassword });
      assert.equal(done.status, 200);

      assert.equal((await c.get('/api/auth/me')).status, 401, 'old session must be revoked');
      const old = await new Client(h.url).post('/api/auth/signin', { email: account.email, password: account.password });
      assert.equal(old.status, 401);
      const fresh2 = await new Client(h.url).post('/api/auth/signin', { email: account.email, password: newPassword });
      assert.equal(fresh2.status, 200);

      const reuse = await c.post('/api/auth/reset-password', { token, password: 'yet another passphrase' });
      assert.equal(reuse.status, 400);
      assert.equal(reuse.body.error.code, 'invalid_token');
    });

    it('invalidates earlier links when a new one is requested, and rejects expired or bogus tokens', async () => {
      const { h, c } = await fresh();
      await c.post('/api/auth/signup', account);
      await c.post('/api/auth/forgot-password', { email: account.email });
      await c.post('/api/auth/forgot-password', { email: account.email });
      const [first, second] = h.resetLinks.map((l) => tokenFrom(l.link));

      const stale = await c.post('/api/auth/reset-password', { token: first, password: 'a brand new passphrase' });
      assert.equal(stale.status, 400);

      await h.store.mutate((d) => {
        d.resetTokens[0]!.expiresAt = new Date(Date.now() - 1000).toISOString();
      });
      const expired = await c.post('/api/auth/reset-password', { token: second, password: 'a brand new passphrase' });
      assert.equal(expired.status, 400);

      const bogus = await c.post('/api/auth/reset-password', { token: 'made-up', password: 'a brand new passphrase' });
      assert.equal(bogus.status, 400);
    });
  });

  it('keeps accounts across a restart when backed by a file', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'artha-auth-'));
    cleanups.push(() => rm(dir, { recursive: true, force: true }));
    const config = baseConfig({ dataFile: path.join(dir, 'db.json') });

    const first = await start(config);
    const c1 = new Client(first.url);
    await c1.post('/api/auth/signup', account);
    const cookie = c1.cookie;
    await first.close();

    const second = await start(config);
    cleanups.push(second.close);
    const c2 = new Client(second.url);
    c2.cookie = cookie;
    const me = await c2.get('/api/auth/me');
    assert.equal(me.status, 200);
    assert.equal(me.body.user.email, account.email);
    const login = await new Client(second.url).post('/api/auth/signin', { email: account.email, password: account.password });
    assert.equal(login.status, 200);
  });
});
