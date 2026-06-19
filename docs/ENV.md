# Environment Variables

Lore uses different environment variables for local development, staging, and production.
Make sure to copy `.env.local.example` to `.env.local` and fill in the missing values.

## Required Variables

### Database
- `DATABASE_URL`: Connection string for PostgreSQL. In production, this should point to the Neon DB.

### Authentication (Auth.js)
- `AUTH_SECRET`: A random 32-character string used to encrypt session data. Generate with `openssl rand -base64 32`.
- `AUTH_URL`: The canonical URL of the application (e.g., `https://lore.example.com`).
- `AUTH_GOOGLE_ID`: Google OAuth client ID.
- `AUTH_GOOGLE_SECRET`: Google OAuth client secret.

### Redis (Upstash)
- `UPSTASH_REDIS_REST_URL`: The REST URL for your Upstash Redis instance.
- `UPSTASH_REDIS_REST_TOKEN`: The REST token for your Upstash Redis instance.

### Observability
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog project API key.
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host URL (e.g., `https://app.posthog.com`).
- `SENTRY_DSN`: The Data Source Name for Sentry error tracking.
- `SENTRY_AUTH_TOKEN`: Token for uploading source maps to Sentry during build.

### App Config
- `NEXT_PUBLIC_APP_URL`: The public URL of the application.
- `NEXT_PUBLIC_BETA_MODE`: Set to `false` to remove the beta gate.

## Environments

- **`.env.local`**: For local development. Uses local Postgres or development Neon DB.
- **`.env.staging`**: For the staging environment. Uses a separate database and Redis instance.
- **`.env.production`**: For the live production environment. Connected to production DB, Redis, and analytics.
