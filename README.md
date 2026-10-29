# ThePhi Digital Agreement Portal

A production-oriented foundation for secure agreement workflows. This branch contains the initial React/Vite web shell, Express API validation boundary, shared domain schemas, and Supabase migration baseline.

## Structure

- `apps/web` — React/Vite responsive portal shell
- `apps/api` — Express API boundary with Helmet, CORS, request limits, and Zod validation
- `packages/shared` — shared status, role, agreement, and signing schemas
- `supabase/migrations` — PostgreSQL schema and initial RLS policies

## Development

1. Copy `.env.example` to `.env` and configure Supabase values.
2. Install dependencies with `npm install`.
3. Run `npm run dev`.
4. Apply the migration through Supabase CLI or the SQL editor.

## Security notes

- The Supabase service-role key is server-only and must never be exposed to Vite.
- `BIOMETRIC_PROVIDER=disabled` is an explicit unconfigured state, not a successful verification fallback.
- WebAuthn verifies an authenticator operation; it does not expose a fingerprint image.
- Actual fingerprint impressions require a selected scanner and documented SDK adapter. No fake capture is implemented.
- Legal validity requires appropriate legal review and cannot be inferred from a PDF hash or fingerprint image.

## Not yet production-ready

Authentication wiring, complete server-side authorization, full RLS coverage, PDF rendering/storage, notification delivery, scanner SDK integration, and end-to-end signing screens remain to be implemented in subsequent commits. Do not deploy this foundation as a production signing service.
