# TJ Nutrition

Personal nutrition and activity PWA. Single user. iPhone-first. Anthropic-powered coaching, Apple Health webhook for steps, Vercel KV for sync.

## Quickstart

```bash
npm install
cp .env.example .env.local
# Generate APP_SECRET
openssl rand -hex 32
# Paste into .env.local along with your ANTHROPIC_API_KEY
npm run dev
```

Then open http://localhost:3000.

## Environment variables

| Var | Where | What |
|---|---|---|
| `ANTHROPIC_API_KEY` | server only | sk-ant-... your Anthropic API key |
| `APP_SECRET` | server only | long random string, used as bearer token on the iOS Shortcut webhook |
| `KV_REST_API_URL` | server only | Vercel KV (auto-injected when you connect a KV store) |
| `KV_REST_API_TOKEN` | server only | Vercel KV (auto-injected) |
| `KV_REST_API_READ_ONLY_TOKEN` | server only | Vercel KV (auto-injected) |
| `NEXT_PUBLIC_APP_URL` | client + server | full origin of the deployed app |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import into Vercel.
3. Storage, Create Database, KV, connect to project.
4. Project settings, Environment Variables: add `ANTHROPIC_API_KEY` and `APP_SECRET`.
5. Redeploy.

## iOS Shortcut

In the deployed app, open `/settings`. The Apple Health webhook section shows the
exact `POST` URL and the JSON body shape. Build a Shortcut with the steps shown,
then schedule it as a Personal Automation that runs every 2 hours.

## Architecture

- App Router, all client state in `useAppState` (IndexedDB cache, debounced KV sync).
- Anthropic API calls only from `app/api/recommend` (server). Key never leaves the server.
- Webhook auth: `Authorization: Bearer <APP_SECRET>`.
- PWA via `next-pwa`, manifest in `public/manifest.json`.
