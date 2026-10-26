import { z } from 'zod';
import { HttpError } from './errors.js';

const email = z
  .string('Email is required.')
  .trim()
  .toLowerCase()
  .pipe(z.email('Enter a valid email address.').max(254, 'Email is too long.'));

const newPassword = z
  .string('Password is required.')
  .min(8, 'Password must be at least 8 characters.')
  .max(128, 'Password must be 128 characters or fewer.');

export const signupSchema = z.object({
  name: z
    .string('Name is required.')
    .trim()
    .min(1, 'Name is required.')
    .max(80, 'Name must be 80 characters or fewer.'),
  email,
  password: newPassword,
});

export const signinSchema = z.object({
  email,
  password: z.string('Password is required.').min(1, 'Password is required.').max(128, 'Password is too long.'),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotSchema = z.object({ email });

export const resetSchema = z.object({
  token: z.string('Reset token is required.').min(1, 'Reset token is required.').max(200, 'Reset token is invalid.'),
  password: newPassword,
});

/** Parse a request body, turning zod issues into a `{ field: message }` map. */
export const parseBody = <S extends z.ZodType>(schema: S, body: unknown): z.output<S> => {
  const result = schema.safeParse(body ?? {});
  if (result.success) return result.data;

  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? 'body');
    fields[key] ??= issue.message;
  }
  throw new HttpError(400, 'validation_error', 'Please check the highlighted fields.', fields);
};
