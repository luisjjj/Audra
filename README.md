# AUDRA — Every action. Accounted for.

Collaborative audit & compliance workspace. Next.js + Drizzle + Neon + Better Auth + R2.

## Quick start (demo, no keys needed)
```bash
npm install
npm run dev
# open http://localhost:3000 → Open demo → /overview
```
Without `DATABASE_URL`, the app runs on realistic seeded in-memory data (Apex Manufacturing Ltd. + Meridian Audit Partners) so every screen works immediately.

## Production wiring
1. Copy `.env.example` → `.env.local`, set `DATABASE_URL` (Neon), `BETTER_AUTH_SECRET`, R2 keys.
2. `npm run db:generate && npm run db:migrate && npm run db:seed`
3. `npm run build && npm start`

## Architecture
```
Next.js (server actions / routes) → Drizzle ORM → Neon Postgres
Documents → signed R2 URLs (never public, never exposed creds)
Audit trail → append-only audit_events with SHA-256 hash chaining
Permissions → server-side role + scope checks (lib/permissions.ts)
```

## Security
- Org isolation + engagement scopes enforced server-side.
- `audit_events` has no update/delete path in app code.
- Downloads via short-lived signed URLs; permission check TODO marker in `app/api/files/route.ts` must be completed before prod.
- Hash chain is an internal integrity mechanism, not legal immutability.
