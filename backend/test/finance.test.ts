import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, describe, it } from 'node:test';
import { createApp } from '../src/app.js';
import type { Config } from '../src/config.js';
import { DEMO_EMAIL, DEMO_PASSWORD, ensureDemoUser } from '../src/demo.js';
import { JsonStore } from '../src/store.js';

const config: Config = {
  env: 'test',
  host: '127.0.0.1',
  port: 0,
  clientOrigins: ['http://localhost:5173'],
  dataFile: null,
  sessionHours: 24,
  rememberMeDays: 30,
  resetTokenMinutes: 30,
  trustProxy: false,
  demoAccount: true,
  rateLimits: { signinAttempts: 50, signupPerWindow: 100, forgotPerWindow: 100, windowMinutes: 15 },
};

class Client {
  cookie = '';
  constructor(private readonly url: string) {}
  async call(method: string, route: string, body?: unknown) {
    const res = await fetch(this.url + route, {
      method,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(this.cookie ? { Cookie: this.cookie } : {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const set = res.headers.getSetCookie().find((c) => c.startsWith('artha_session='));
    if (set) this.cookie = set.split(';')[0]!;
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  }
}

describe('finance API', () => {
  const closers: (() => Promise<void>)[] = [];
  after(async () => {
    for (const c of closers) await c();
  });

  const boot = async () => {
    const store = new JsonStore(null);
    await store.load();
    await ensureDemoUser(store);
    const app = createApp({ config, store, mailer: { sendPasswordReset: () => undefined } });
    const server: Server = await new Promise((r) => {
      const s = app.listen(0, '127.0.0.1', () => r(s));
    });
    closers.push(() => new Promise<void>((r) => server.close(() => r())));
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const signup = async (email: string) => {
      const c = new Client(url);
      const res = await c.call('POST', '/api/auth/signup', { name: 'Test User', email, password: 'correct horse battery' });
      assert.equal(res.status, 201);
      return c;
    };
    return { url, signup };
  };

  it('requires sign-in', async () => {
    const { url } = await boot();
    assert.equal((await new Client(url).call('GET', '/api/finance')).status, 401);
  });

  it('gives a new user empty data and no demo content', async () => {
    const { signup } = await boot();
    const c = await signup('new@example.com');
    const res = await c.call('GET', '/api/finance');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { accounts: [], transactions: [], bills: [], budgets: {}, goals: [] });
  });

  it('seeds the demo login with sample data and resets it on sign-in', async () => {
    const { url } = await boot();
    const c = new Client(url);
    const login = await c.call('POST', '/api/auth/signin', { email: DEMO_EMAIL, password: DEMO_PASSWORD });
    assert.equal(login.status, 200);
    const data = (await c.call('GET', '/api/finance')).body;
    assert.equal(data.accounts.length, 5);
    assert.ok(data.transactions.length > 20);
    assert.ok(data.bills.length > 5);

    const first = data.transactions[0].id;
    await c.call('POST', '/api/finance/transactions/delete', { ids: [first] });
    assert.equal((await c.call('GET', '/api/finance')).body.transactions.length, data.transactions.length - 1);

    const again = new Client(url);
    await again.call('POST', '/api/auth/signin', { email: DEMO_EMAIL, password: DEMO_PASSWORD });
    assert.equal((await again.call('GET', '/api/finance')).body.transactions.length, data.transactions.length);
  });

  it('runs the full data-entry flow and keeps users apart', async () => {
    const { signup } = await boot();
    const c = await signup('flow@example.com');

    // A transaction needs a real account.
    let res = await c.call('POST', '/api/finance/transactions', { name: 'Chai', amount: -40, date: '2026-01-05', category: 'food', account: 'Nope' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error.fields.account);

    res = await c.call('POST', '/api/finance/accounts', { name: 'Savings', kind: 'asset', type: 'Savings', opening: 1000 });
    assert.equal(res.status, 201);
    res = await c.call('POST', '/api/finance/accounts', { name: 'savings', kind: 'asset', type: 'Cash' });
    assert.equal(res.status, 409);

    res = await c.call('POST', '/api/finance/transactions', { name: 'Chai', amount: -40, date: '2026-01-05', category: 'food', account: 'Savings' });
    assert.equal(res.status, 201);
    assert.equal(res.body.transactions.length, 1);
    const id = res.body.transactions[0].id;

    for (const bad of [{ amount: 0 }, { date: '2026-02-31' }, { category: 'nope' }]) {
      const r = await c.call('POST', '/api/finance/transactions', { name: 'x', amount: -1, date: '2026-01-05', category: 'food', account: 'Savings', ...bad });
      assert.equal(r.status, 400);
    }

    res = await c.call('PATCH', '/api/finance/transactions', { ids: [id], patch: { category: 'shopping', excluded: true }, addTags: ['Work Trip'] });
    assert.equal(res.body.transactions[0].category, 'shopping');
    assert.equal(res.body.transactions[0].excluded, true);
    assert.deepEqual(res.body.transactions[0].tags, ['work-trip']);

    // Accounts with transactions cannot be removed.
    const acct = res.body.accounts[0].id;
    assert.equal((await c.call('DELETE', `/api/finance/accounts/${acct}`)).status, 409);

    res = await c.call('POST', '/api/finance/bills', { name: 'Rent', amount: 500, dueDate: '2026-02-01', frequency: 'Monthly', category: 'housing', autopay: false });
    const billId = res.body.bills[0].id;
    res = await c.call('POST', `/api/finance/bills/${billId}/pay`, {});
    assert.equal(res.body.bills[0].status, 'paid');
    assert.equal(res.body.transactions.length, 2);

    res = await c.call('PUT', '/api/finance/budgets/food', { amount: 3000 });
    assert.equal(res.body.budgets.food, 3000);
    assert.equal((await c.call('PUT', '/api/finance/budgets/nope', { amount: 1 })).status, 404);

    res = await c.call('POST', '/api/finance/goals', { name: 'Trip', target: 100, deadline: '2027-01-01' });
    res = await c.call('POST', `/api/finance/goals/${res.body.goals[0].id}/contribute`, { amount: 500 });
    assert.equal(res.body.goals[0].saved, 100);

    res = await c.call('POST', '/api/finance/transactions/delete', { ids: [id] });
    assert.equal(res.body.transactions.length, 1);

    // Another user never sees this data.
    const other = await signup('other@example.com');
    assert.equal((await other.call('GET', '/api/finance')).body.transactions.length, 0);
    assert.equal((await other.call('POST', `/api/finance/bills/${billId}/pay`, {})).status, 404);
  });
});
