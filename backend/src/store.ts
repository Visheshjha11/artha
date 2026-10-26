import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  /** SHA-256 of the cookie token; the raw token is never stored. */
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface ResetToken {
  /** SHA-256 of the emailed token. */
  id: string;
  userId: string;
  expiresAt: string;
  usedAt: string | null;
}

export interface Data {
  users: User[];
  sessions: Session[];
  resetTokens: ResetToken[];
}

const emptyData = (): Data => ({ users: [], sessions: [], resetTokens: [] });

/**
 * Tiny JSON-file persistence layer for local development.
 *
 * All changes go through `mutate`, whose callback runs synchronously, so
 * read-check-write sequences (for example "email not taken, then insert")
 * are atomic. Writes are queued and land via temp file + rename, so a crash
 * mid-write cannot leave a half-written database behind.
 *
 * Pass `null` as the file path for a purely in-memory store (used by tests).
 */
export class JsonStore {
  private data: Data = emptyData();
  private queue: Promise<void> = Promise.resolve();

  constructor(private readonly file: string | null) {}

  async load(): Promise<void> {
    if (!this.file) return;
    try {
      const raw = await readFile(this.file, 'utf8');
      const parsed = JSON.parse(raw) as Partial<Data>;
      this.data = {
        users: parsed.users ?? [],
        sessions: parsed.sessions ?? [],
        resetTokens: parsed.resetTokens ?? [],
      };
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        this.data = emptyData();
        return;
      }
      // Refuse to start rather than overwrite a database we could not read.
      throw new Error(`Could not read ${this.file}: ${(err as Error).message}`);
    }
  }

  read<T>(fn: (data: Readonly<Data>) => T): T {
    return fn(this.data);
  }

  async mutate<T>(fn: (data: Data) => T): Promise<T> {
    const result = fn(this.data);
    await this.persist();
    return result;
  }

  /** Drop expired sessions and reset tokens. */
  async purgeExpired(now = Date.now()): Promise<void> {
    await this.mutate((d) => {
      d.sessions = d.sessions.filter((s) => Date.parse(s.expiresAt) > now);
      d.resetTokens = d.resetTokens.filter((t) => Date.parse(t.expiresAt) > now);
    });
  }

  /** Resolves once every queued write has reached disk. */
  flush(): Promise<void> {
    return this.queue;
  }

  private persist(): Promise<void> {
    if (!this.file) return Promise.resolve();
    const file = this.file;
    const snapshot = JSON.stringify(this.data, null, 2);
    const write = async () => {
      await mkdir(path.dirname(file), { recursive: true });
      const tmp = `${file}.${process.pid}.tmp`;
      await writeFile(tmp, snapshot, { mode: 0o600 });
      await rename(tmp, file);
    };
    const next = this.queue.then(write, write);
    this.queue = next.catch(() => undefined);
    return next;
  }
}
