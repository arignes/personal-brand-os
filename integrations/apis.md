# API Integrations — Inventory & Conventions

> ⚠️ **STATUS: AWAITING KEYS.** Arina will send several API keys. Each gets a row below when received.

## Secrets convention (hard rule)

- **Keys never appear in this repo** — not in MD, not in YAML, not in code.
- Local dev: `.env` (gitignored), loaded at startup.
- Production: Supabase Vault / Edge Function secrets.
- This file documents *which* keys exist and *what they're for* — never their values.

## Inventory

| Service | Env var | Used by | Status | Notes |
|---|---|---|---|---|
| Claude API | `ANTHROPIC_API_KEY` | scoring, drafting, voice check, weekly analysis | expected | |
| **SocialCrawl** | `SOCIALCRAWL_API_KEY` | **primary signal source** — X + LinkedIn + Reddit + news/search, 42 platforms; Monitors (scheduled re-runs + webhooks) | ✅ key in hand (in `web/.env.local`) | ⚠️ key shared in plaintext chat 2026-06-19 → rotate. Credit-metered. Covers LinkedIn reading, our old gap |
| TwitterAPI.io | `TWITTERAPI_IO_KEY` | X own-post analytics (Stats); secondary X signals | likely (used in hype-leaderboard) | read-only; may be redundant with SocialCrawl for signals |
| X official API | `X_API_KEY` etc. | posting/DMs via API (optional) | TBD | depends on tier |
| Image generation | TBD | photo drafts | TBD | model choice pending |
| Search/news | (SocialCrawl covers) | news-hook signals | ✅ via SocialCrawl | Google News/Web, Hacker News, Perplexity, Tavily all under SocialCrawl |
| Scraping (Apify / ScrapeCreators / Browserbase…) | TBD | LinkedIn public data | superseded | SocialCrawl covers LinkedIn reading; keep prior stack only if a gap appears |
| Supabase | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | everything | when project created | service role key server-side only |
| SMTP / push | TBD | weekly digest, review reminders | TBD | |

## SocialCrawl (added 2026-06-19)

Unified API across 42 platforms (TikTok, Instagram, YouTube, X, **LinkedIn**, Threads, Bluesky, Reddit, plus Google News/Web, Hacker News, Perplexity, Tavily, GitHub, app stores, review sites). Normalized schemas: profiles, posts, comments, search, trending, transcripts, demographics, ad libraries.

Why it matters here: it can be the **single signal source** for the whole pipeline — X + LinkedIn + news in one integration, including LinkedIn *reading* (others' posts), which our prior plan couldn't do cleanly. Its **Monitors** (scheduled re-runs with webhook delivery) map directly onto our `signals` ingestion cron — could replace a hand-rolled scheduler.

**Decision (2026-06-19): the app uses the DIRECT API, not MCP.** Both use the same `SOCIALCRAWL_API_KEY`; the MCP server is just a thin wrapper over the same REST API. For a deployed app the direct call is better — lower latency (no `npx` subprocess per call), runs in Vercel serverless functions, full control over retries/rate limits.

Two ways to use it:
1. **Direct API (the app's path)** — the Next.js worker calls SocialCrawl over HTTPS with `SOCIALCRAWL_API_KEY` from env. This is what production uses.
2. **MCP server (dev only, optional)** — lets the agent pull a few live signals inside a Claude Code session to preview real data before the backend exists. Not used by the deployed app.

Skill install: `npx skills add socialcrawl/skills`.

MCP config (key via env, do not paste the literal into committed files):
```json
{ "mcpServers": { "socialcrawl": {
  "command": "npx", "args": ["-y", "socialcrawl-mcp"],
  "env": { "SOCIALCRAWL_API_KEY": "<from your shell env, not committed>" }
}}}
```

⚠️ **Security:** the key was shared in plaintext chat on 2026-06-19. Rotate it in the SocialCrawl dashboard; the live value currently lives only in `web/.env.local` (gitignored). It is credit-metered, so a leaked key can burn balance.

## Per-integration checklist (when a key arrives)

1. Add row above with env var name + owner pipeline
2. Note rate limits + cost per call
3. Add a smoke-test command
4. Document failure mode (what the pipeline does when this API is down)
