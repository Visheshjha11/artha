import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { z } from 'zod';

const backendRoot = path.resolve(import.meta.dirname, '..');

export interface Config {
  env: 'development' | 'production' | 'test';
  host: string;
  port: number;
  clientOrigins: string[];
  dataFile: string | null;
  sessionHours: number;
  rememberMeDays: number;
  resetTokenMinutes: number;
  trustProxy: boolean;
  rateLimits: {
    signinAttempts: number;
    signupPerWindow: number;
    forgotPerWindow: number;
    windowMinutes: number;
  };
}

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(0).max(65535).default(4000),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173,http://127.0.0.1:5173'),
  DATA_FILE: z.string().min(1).default('data/db.json'),
  SESSION_HOURS: z.coerce.number().positive().default(24),
  REMEMBER_ME_DAYS: z.coerce.number().positive().default(30),
  RESET_TOKEN_MINUTES: z.coerce.number().positive().default(30),
  TRUST_PROXY: z.enum(['true', 'false']).default('false'),
});

export const loadConfig = (): Config => {
  loadEnv({ path: path.join(backendRoot, '.env'), quiet: true });

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${details}`);
  }
  const env = parsed.data;

  return {
    env: env.NODE_ENV,
    host: env.HOST,
    port: env.PORT,
    clientOrigins: env.CLIENT_ORIGIN.split(',')
      .map((o) => o.trim().replace(/\/$/, ''))
      .filter(Boolean),
    dataFile: path.resolve(backendRoot, env.DATA_FILE),
    sessionHours: env.SESSION_HOURS,
    rememberMeDays: env.REMEMBER_ME_DAYS,
    resetTokenMinutes: env.RESET_TOKEN_MINUTES,
    trustProxy: env.TRUST_PROXY === 'true',
    rateLimits: {
      signinAttempts: 8,
      signupPerWindow: 20,
      forgotPerWindow: 5,
      windowMinutes: 15,
    },
  };
};
