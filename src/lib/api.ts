// Thin client for the local auth backend (see /backend).
// Requests go to /api/... and the Vite dev server proxies them to the backend,
// so the session cookie stays same-origin and no CORS setup is needed.

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export class ApiError extends Error {
  status: number;
  code: string;
  fields: Record<string, string> | undefined;

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

const UNREACHABLE =
  'Cannot reach the server. Start the backend with "npm run dev" inside the backend folder.';

async function request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/auth${path}`, {
      method,
      credentials: 'same-origin',
      ...(body !== undefined
        ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        : {}),
    });
  } catch {
    throw new ApiError(0, 'network', UNREACHABLE);
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = data?.error;
    // The dev proxy answers 5xx with an empty body when the backend is down.
    if (!err && res.status >= 500) throw new ApiError(res.status, 'network', UNREACHABLE);
    throw new ApiError(
      res.status,
      err?.code ?? 'unknown',
      err?.message ?? 'Something went wrong. Please try again.',
      err?.fields,
    );
  }
  return data as T;
}

export const api = {
  signup: (input: { name: string; email: string; password: string }) =>
    request<{ user: ApiUser }>('POST', '/signup', input),
  signin: (input: { email: string; password: string; rememberMe: boolean }) =>
    request<{ user: ApiUser }>('POST', '/signin', input),
  signout: () => request<void>('POST', '/signout', {}),
  me: () => request<{ user: ApiUser }>('GET', '/me'),
  forgotPassword: (email: string) =>
    request<{ message: string }>('POST', '/forgot-password', { email }),
};

/** Text for the toast: the first field problem if there is one, else the general message. */
export const errorText = (err: unknown): string => {
  if (err instanceof ApiError) return Object.values(err.fields ?? {})[0] ?? err.message;
  return 'Something went wrong. Please try again.';
};
