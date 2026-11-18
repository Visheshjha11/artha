import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { dayOffset } from '../dates.js';
import { HttpError } from '../errors.js';
import { requireAuth } from '../middleware.js';
import { emptyFinance, type FinanceData, type JsonStore } from '../store.js';
import { parseBody } from '../validation.js';

const MAX_TRANSACTIONS = 20_000;
const MAX_ACCOUNTS = 50;
const MAX_BILLS = 500;
const MAX_GOALS = 100;
const MAX_AMOUNT = 1_000_000_000_000;

const CATEGORY_KEYS = [
  'income', 'interest', 'housing', 'food', 'transport', 'entertainment',
  'shopping', 'utilities', 'health', 'subscriptions', 'insurance',
] as const;

const category = z.enum(CATEGORY_KEYS, 'Pick a valid category.');

const isoDate = z
  .string('Date is required.')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD.')
  .refine((s) => {
    const d = new Date(`${s}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
  }, 'Enter a real date.');

const money = (label: string) =>
  z.number(`${label} is required.`).finite(`${label} must be a number.`).max(MAX_AMOUNT, `${label} is too large.`);

const tag = z
  .string()
  .trim()
  .toLowerCase()
  .transform((s) => s.replace(/\s+/g, '-'))
  .pipe(z.string().min(1).max(30, 'Tags must be 30 characters or fewer.'));
const tags = z.array(tag).max(20, 'Too many tags.');

const ids = z.array(z.string().min(1).max(64)).min(1, 'Select at least one transaction.').max(1000);

const accountSchema = z.object({
  name: z.string('Name is required.').trim().min(1, 'Name is required.').max(60, 'Name must be 60 characters or fewer.'),
  kind: z.enum(['asset', 'liability'], 'Pick asset or liability.'),
  type: z.string('Type is required.').trim().min(1, 'Type is required.').max(30, 'Type must be 30 characters or fewer.'),
  opening: money('Opening balance').min(0, 'Opening balance cannot be negative.').default(0),
});

const transactionSchema = z.object({
  name: z.string('Name is required.').trim().min(1, 'Name is required.').max(120, 'Name must be 120 characters or fewer.'),
  amount: money('Amount').refine((n) => n !== 0, 'Amount cannot be zero.'),
  date: isoDate,
  category,
  account: z.string('Account is required.').trim().min(1, 'Account is required.'),
  tags: tags.optional(),
  notes: z.string().trim().max(500, 'Notes must be 500 characters or fewer.').optional(),
});

const patchSchema = z.object({
  ids,
  patch: z
    .object({
      category: category.optional(),
      excluded: z.boolean().optional(),
      notes: z.string().trim().max(500).optional(),
      tags: tags.optional(),
    })
    .optional()
    .default({}),
  addTags: tags.optional(),
});

const deleteSchema = z.object({ ids });

const billSchema = z.object({
  name: z.string('Name is required.').trim().min(1, 'Name is required.').max(120, 'Name must be 120 characters or fewer.'),
  amount: money('Amount').positive('Amount must be greater than 0.'),
  dueDate: isoDate,
  frequency: z.enum(['Monthly', 'Quarterly', 'Yearly'], 'Pick a frequency.'),
  category,
  autopay: z.boolean().default(false),
});

const payBillSchema = z.object({ account: z.string().trim().min(1).optional() });
const budgetSchema = z.object({ amount: money('Budget').min(0, 'Budget cannot be negative.') });
const goalSchema = z.object({
  name: z.string('Name is required.').trim().min(1, 'Name is required.').max(80, 'Name must be 80 characters or fewer.'),
  target: money('Target').positive('Target must be greater than 0.'),
  deadline: isoDate,
});
const contributeSchema = z.object({ amount: money('Amount').positive('Amount must be greater than 0.') });

const missing = (what: string) => new HttpError(404, 'not_found', `${what} not found.`);

export const createFinanceRouter = ({ store }: { store: JsonStore }): Router => {
  const router = Router();
  router.use(requireAuth);

  const uid = (res: { locals: { auth?: { user: { id: string } } } }) => res.locals.auth!.user.id;

  const snapshot = (userId: string): FinanceData =>
    store.read((d) => d.finance[userId]) ?? emptyFinance();

  /** Run a change against this user's data atomically and return the new snapshot. */
  const change = async (userId: string, fn: (f: FinanceData) => void): Promise<FinanceData> => {
    await store.mutate((d) => {
      const f = (d.finance[userId] ??= emptyFinance());
      fn(f);
    });
    return snapshot(userId);
  };

  const hasAccount = (f: FinanceData, name: string) => f.accounts.some((a) => a.name === name);
  const noAccount = () =>
    new HttpError(400, 'validation_error', 'Choose one of your accounts.', { account: 'Choose one of your accounts. Add an account first if you have none.' });

  router.get('/', (_req, res) => {
    res.json(snapshot(uid(res)));
  });

  /* ------------------------------ accounts ------------------------------ */

  router.post('/accounts', async (req, res) => {
    const input = parseBody(accountSchema, req.body);
    const result = await change(uid(res), (f) => {
      if (f.accounts.length >= MAX_ACCOUNTS) throw new HttpError(409, 'limit_reached', 'You have reached the account limit.');
      if (f.accounts.some((a) => a.name.toLowerCase() === input.name.toLowerCase())) {
        throw new HttpError(409, 'name_taken', 'You already have an account with this name.', {
          name: 'You already have an account with this name.',
        });
      }
      f.accounts.push({ id: randomUUID(), ...input });
    });
    res.status(201).json(result);
  });

  router.delete('/accounts/:id', async (req, res) => {
    const result = await change(uid(res), (f) => {
      const a = f.accounts.find((x) => x.id === req.params.id);
      if (!a) throw missing('Account');
      if (f.transactions.some((t) => t.account === a.name)) {
        throw new HttpError(409, 'account_in_use', 'Delete or move this account’s transactions first.');
      }
      f.accounts = f.accounts.filter((x) => x.id !== a.id);
    });
    res.json(result);
  });

  /* ---------------------------- transactions ---------------------------- */

  router.post('/transactions', async (req, res) => {
    const input = parseBody(transactionSchema, req.body);
    const result = await change(uid(res), (f) => {
      if (!hasAccount(f, input.account)) throw noAccount();
      if (f.transactions.length >= MAX_TRANSACTIONS) throw new HttpError(409, 'limit_reached', 'You have reached the transaction limit.');
      const { tags: tagList, notes, ...base } = input;
      f.transactions.unshift({
        id: randomUUID(),
        ...base,
        ...(tagList?.length ? { tags: [...new Set(tagList)] } : {}),
        ...(notes ? { notes } : {}),
      });
    });
    res.status(201).json(result);
  });

  router.patch('/transactions', async (req, res) => {
    const { ids: target, patch, addTags } = parseBody(patchSchema, req.body);
    const set = new Set(target);
    const result = await change(uid(res), (f) => {
      for (const t of f.transactions) {
        if (!set.has(t.id)) continue;
        if (patch.category !== undefined) t.category = patch.category;
        if (patch.excluded !== undefined) t.excluded = patch.excluded;
        if (patch.notes !== undefined) t.notes = patch.notes;
        if (patch.tags !== undefined) t.tags = [...new Set(patch.tags)];
        if (addTags?.length) t.tags = [...new Set([...(t.tags ?? []), ...addTags])].slice(0, 20);
      }
    });
    res.json(result);
  });

  router.post('/transactions/delete', async (req, res) => {
    const { ids: target } = parseBody(deleteSchema, req.body);
    const drop = new Set(target);
    res.json(await change(uid(res), (f) => {
      f.transactions = f.transactions.filter((t) => !drop.has(t.id));
    }));
  });

  /* -------------------------------- bills -------------------------------- */

  router.post('/bills', async (req, res) => {
    const input = parseBody(billSchema, req.body);
    const result = await change(uid(res), (f) => {
      if (f.bills.length >= MAX_BILLS) throw new HttpError(409, 'limit_reached', 'You have reached the bill limit.');
      f.bills.push({ id: randomUUID(), ...input, status: 'unpaid' });
    });
    res.status(201).json(result);
  });

  router.post('/bills/:id/pay', async (req, res) => {
    const { account } = parseBody(payBillSchema, req.body);
    res.json(await change(uid(res), (f) => {
      const bill = f.bills.find((b) => b.id === req.params.id);
      if (!bill) throw missing('Bill');
      if (bill.status === 'paid') return;
      const from = account ?? f.accounts[0]?.name;
      if (!from || !hasAccount(f, from)) throw noAccount();
      const today = dayOffset(0);
      bill.status = 'paid';
      bill.paidOn = today;
      f.transactions.unshift({
        id: randomUUID(),
        name: bill.name,
        amount: -bill.amount,
        date: today,
        category: bill.category,
        account: from,
      });
    }));
  });

  router.delete('/bills/:id', async (req, res) => {
    res.json(await change(uid(res), (f) => {
      if (!f.bills.some((b) => b.id === req.params.id)) throw missing('Bill');
      f.bills = f.bills.filter((b) => b.id !== req.params.id);
    }));
  });

  /* ------------------------- budgets and goals ------------------------- */

  router.put('/budgets/:category', async (req, res) => {
    const key = category.safeParse(req.params.category);
    if (!key.success) throw missing('Category');
    const { amount } = parseBody(budgetSchema, req.body);
    res.json(await change(uid(res), (f) => {
      f.budgets[key.data] = amount;
    }));
  });

  router.post('/goals', async (req, res) => {
    const input = parseBody(goalSchema, req.body);
    const result = await change(uid(res), (f) => {
      if (f.goals.length >= MAX_GOALS) throw new HttpError(409, 'limit_reached', 'You have reached the goal limit.');
      f.goals.push({ id: randomUUID(), ...input, saved: 0 });
    });
    res.status(201).json(result);
  });

  router.post('/goals/:id/contribute', async (req, res) => {
    const { amount } = parseBody(contributeSchema, req.body);
    res.json(await change(uid(res), (f) => {
      const g = f.goals.find((x) => x.id === req.params.id);
      if (!g) throw missing('Goal');
      g.saved = Math.min(g.target, g.saved + amount);
    }));
  });

  return router;
};
