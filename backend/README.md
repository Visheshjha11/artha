# Artha backend (local auth API)

Express + TypeScript service that handles accounts and sessions for local development.
Users and sessions live in a JSON file (`data/db.json`, git-ignored), so there is nothing else to install or run.

## Run

```bash
cd backend
npm install
cp .env.example .env   # optional, every value has a default
npm run dev            # http://127.0.0.1:4000, restarts on change
```

Other scripts: `npm start`, `npm test`, `npm run typecheck`.

## Endpoints

All bodies are JSON. Errors look like `{ "error": { "code", "message", "fields?" } }`.

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| GET | `/api/health` | | `200 { status: "ok" }` |
| POST | `/api/auth/signup` | `name`, `email`, `password` (8-128 chars) | `201 { user }` and session cookie |
| POST | `/api/auth/signin` | `email`, `password`, `rememberMe?` | `200 { user }` and session cookie |
| POST | `/api/auth/signout` | | `204`, session revoked |
| GET | `/api/auth/me` | | `200 { user }` or `401` |
| POST | `/api/auth/forgot-password` | `email` | `200`, same answer for any email |
| POST | `/api/auth/reset-password` | `token`, `password` | `200`, all sessions revoked |

Status codes worth handling in the UI: `400` validation (see `error.fields`), `401` bad credentials,
`409` email already registered, `429` too many attempts (see `Retry-After`).

## Calling it from the frontend

The session is an `httpOnly` cookie named `artha_session`, so browser requests must send credentials:

```ts
fetch('http://localhost:4000/api/auth/signin', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, rememberMe }),
});
```

Browser origins listed in `CLIENT_ORIGIN` (default `http://localhost:5173`) are allowed by CORS.

## Password reset in development

There is no email provider. `forgot-password` prints the reset link to the server console.
The link ends in `?token=...`; post that token with a new password to `/api/auth/reset-password`.

## Security notes

- Passwords are hashed with scrypt; session and reset tokens are random and only their SHA-256 is stored.
- Sessions expire after `SESSION_HOURS` (or `REMEMBER_ME_DAYS` with "keep me signed in") and are revoked on sign-out and password reset.
- Sign-in, sign-up and reset requests are rate limited in memory per IP (sign-in per IP and email).
- State-changing requests from an unrecognised `Origin` are refused.
- Google and GitHub sign-in are not implemented; they need OAuth client credentials.
- The JSON store is meant for one local process. Replace `src/store.ts` with a real database before deploying.
