# NEXT_PLAN: Resend Magic Links Integration

## Objective
Implement a "Magic Link" passwordless authentication flow using Resend alongside our existing Google OAuth integration. This keeps our `database` session strategy intact and provides users with a secure, frictionless login option.

## Prerequisites
- A Resend API Key.
- A verified domain (or testing email) configured in Resend.
- Environment variables added to `.env.local`:
  - `RESEND_API_KEY="re_..."`
  - `EMAIL_FROM="onboarding@resend.dev"` (or your custom domain email)

## Step-by-Step Implementation Plan

### 1. Install Dependencies
Install the Resend package (helpful if we want to customize the magic link email template):
```bash
pnpm add resend
```

### 2. Configure Auth.js (`lib/auth.ts`)
- Import the Resend provider: `import Resend from "next-auth/providers/resend"`.
- Add the `Resend` provider to the `providers` array in the NextAuth configuration.
- Wire it up to use the `RESEND_API_KEY` and `EMAIL_FROM` environment variables.

### 3. Update the Authentication Pages
- **Files:** `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx`.
- **Changes:**
  - Add an `<input type="email" />` field to accept the user's email address.
  - Add a "Continue with Email" submit button.
  - Implement a client-side action that calls `signIn('resend', { email, callbackUrl: '/feed', redirect: false })`.
  - Ensure the UI handles pending states (e.g., displaying a "Check your email!" message after submission).
  - Use `framer-motion` to gracefully animate between the "Enter Email" input state and the "Email Sent" success state.

### 4. Database Schema Verification
- Confirm that the `VerificationToken` model exists in `prisma/schema.prisma` (Already confirmed ✅). This model will be used by Prisma to temporarily store the magic link tokens.

### 5. Custom Email Templates (Optional Polish)
- Auth.js provides a standard, plain-text magic link email by default.
- *Phase 4 Polish:* We can customize the `sendVerificationRequest` callback inside `lib/auth.ts` to send a beautifully styled HTML email that matches Lore's "Dark Editorial" design system.

## Success Criteria
- [ ] Users can enter an email address on the login/signup page.
- [ ] An email containing a magic link is successfully delivered via Resend.
- [ ] Clicking the link successfully authenticates the user and creates a session in PostgreSQL.
- [ ] The user is seamlessly redirected to the `/feed` page.

---

## Redis & Rate Limiting Implementation

The Redis and Rate Limiting features using Upstash were removed from the initial setup to simplify the current development phase. They should be reintroduced prior to production or public launch.

**Implementation Plan:**

1. **Re-install Dependencies:**
   ```bash
   pnpm add @upstash/redis @upstash/ratelimit
   ```

2. **Configure Redis Client (`lib/cache/redis.ts`):**
   - Create a Redis client instance that strictly requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables.

3. **Configure Rate Limiter (`lib/cache/rate-limit.ts`):**
   - Setup a sliding window rate limiter (e.g., 100 requests per 1 minute).

4. **Integrate into Middleware (`proxy.ts`):**
   - Add the rate limiter back into the API routes interception block within `proxy.ts` to protect against spam or brute-force attacks.

5. **Update Documentation:**
   - Ensure the `.env.example` or `docs/ENV.md` reflects the required Upstash keys.
   - Run a rate limit audit (as noted in Phase 8 of PROGRESS.md) to ensure endpoints are adequately protected.

---

## Sentry Error Monitoring Integration

The Sentry integration for monitoring frontend errors, API failures, and performance tracking was deferred. It should be implemented as part of the production readiness phase.

**Implementation Plan:**

1. **Install Dependencies:**
   ```bash
   pnpm add @sentry/nextjs
   ```

2. **Run Sentry Wizard or Create Configurations:**
   - Either run `npx @sentry/wizard@latest -i nextjs` or manually create:
     - `sentry.client.config.ts`
     - `sentry.server.config.ts`
     - `sentry.edge.config.ts`

3. **Update Next.js Configuration:**
   - Wrap `next.config.ts` with `withSentryConfig`.

4. **Environment Variables:**
   - Ensure a valid `NEXT_PUBLIC_SENTRY_DSN` is added to production environment variables.
