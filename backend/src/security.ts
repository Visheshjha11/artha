import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';

const SCRYPT = { N: 16384, r: 8, p: 1, keyLength: 64 } as const;

const derive = (password: string, salt: Buffer, keyLength: number, N: number, r: number, p: number) =>
  new Promise<Buffer>((resolve, reject) => {
    scrypt(password.normalize('NFKC'), salt, keyLength, { N, r, p }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });

/** Returns `scrypt$N$r$p$salt$hash` (base64 parts) so parameters can change later. */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16);
  const key = await derive(password, salt, SCRYPT.keyLength, SCRYPT.N, SCRYPT.r, SCRYPT.p);
  return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64'), key.toString('base64')].join('$');
};

export const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  const [scheme, n, r, p, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !n || !r || !p || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64');
  const actual = await derive(password, Buffer.from(salt, 'base64'), expected.length, Number(n), Number(r), Number(p));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
};

// A real hash of a throwaway password, used to spend the same time on
// unknown emails as on wrong passwords so response timing does not reveal
// which accounts exist.
let dummyHash: Promise<string> | undefined;
export const burnPasswordCheck = async (password: string): Promise<void> => {
  dummyHash ??= hashPassword(randomUUID());
  await verifyPassword(password, await dummyHash);
};

export const newToken = (): string => randomBytes(32).toString('base64url');

export const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');
