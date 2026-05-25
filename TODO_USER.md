# Blockers: Next Steps for Talles

## 1. Infra Setup

- **Supabase CLI**: Install or start MCP server:

```bash
pnpm add supabase --global
# OR
supabase serve --experimental
```

- **TypeScript**: Install dev dependencies:

```bash
pnpm add -D typescript @types/node
```

## 2. Schema Migration

Apply the SQL file once Supabase is accessible:

```bash
supabase db reset --local
# OR
psql "postgresql://postgres:postgres@localhost:5432/postgres" -f migrations/0002_diagnostic_sessions.sql
```

## 3. Real Supabase Integration

Uncomment the Supabase client calls in `/api/diagnostico` once the schema is live:

```ts
const { data, error } = await supabase.from("diagnostic_sessions").insert([{...}])
```

## 4. Resend Integration

Replace mock `fetch` in `/api/diagnostico/notify` with real Resend API:

```ts
const resend = new Resend(process.env.RESEND_API_KEY);
```

## 5. Production Readiness

- **Stripe Checkout**: Ensure pre-fill URLs include `?arquetipo=${archetype_key}&email=${encodedEmail}`.
- **Vercel**: Validate env vars (`NEXT_PUBLIC_SUPABASE_*`).
