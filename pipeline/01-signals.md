# Signal Engine — Find What's Worth Acting On

A **signal** is anything in the feed worth Arina's attention: a trending conversation in her niche, a person she should connect with, a news hook for a post, a thread she should reply to.

## Sources

**Primary: SocialCrawl** (key in hand, 2026-06-19) — one API for X, LinkedIn, Reddit, news/search and 38 other platforms, with scheduled Monitors (webhook delivery) that can drive ingestion directly. See `integrations/apis.md`.

| Source | What it gives | Status |
|---|---|---|
| **SocialCrawl** | niche search across X + LinkedIn + Reddit + news in one call; trending; Monitors for scheduled re-runs | ✅ primary |
| TwitterAPI.io | X own-post analytics for Stats; backup X signals | secondary |
| Manual | Arina pastes a link/idea into the app | always available |

LinkedIn *reading* (others' posts as signals) is now covered by SocialCrawl — the old scraper gap is closed. LinkedIn *own-account analytics* for Stats is still export/manual until confirmed in SocialCrawl's LinkedIn schema.

## Flow

```
sources → ingest (cron, every 2–4h) → normalize → dedupe → heuristic filter → Claude scoring → signals table → iOS Today feed
```

### 1. Ingest & normalize
Every source maps to one shape: `{source, url, author, text, metrics, found_at}`. Dedupe by URL hash.

### 2. Heuristic pre-filter (free, no AI)
Score 0–100 on:
- keyword match vs `brand/messaging.md` signal keywords
- author size & relevance (follower floor, niche match)
- recency decay (signals rot fast — half-life ~24h)
- engagement velocity (likes/hour, not absolute likes)

Below threshold (default 30) → dropped silently. Same pattern as job-agent's `heuristic_score`.

### 3. Claude scoring (only survivors)
Claude gets the signal + brand files, returns:

```json
{
  "score": 0-5,
  "action": "CONTACT | CONTENT | REPLY | SKIP",
  "lane": "mine | adjacent | never",
  "reason": "one sentence",
  "angle": "READY-TO-PASTE line, not a suggestion to write one",
  "pillar": "which messaging pillar this maps to"
}
```

Two rules borrowed from hype-social:
- **Lane check first** (see `brand/messaging.md` → Lanes). `never` = auto-SKIP regardless of score; `adjacent` = angle must stay at pattern level. Author on the Avoid list in `brand/people.md` = auto-SKIP.
- **The angle is the deliverable.** For REPLY and CONTACT, `angle` must be a finished line in Arina's voice that she can paste with a light edit. If Claude can't write a shippable angle, the action is SKIP.

### 4. Routing
- `CONTACT` → contact engine (`02-contacts.md`)
- `CONTENT` → content engine (`03-content.md`)
- `REPLY` → reply queue (lightweight content: drafted reply, approve in app)
- everything lands in the iOS **Today** feed sorted by score

## Signal lifecycle (simple rules)

- Pending signals **expire after 24h** — stale signals disappear from the feed on their own.
- Signals Arina acted on or dismissed are **kept forever** as history (that's what dedup checks against).
- Expired-but-undecided signals can resurface later if the topic spikes again.

## Tunables (live in config, learned by analytics later)

- `heuristic_threshold` (default 30)
- per-pillar keyword weights
- author follower floor per source
- max signals/day surfaced to Arina (default 20 — protect attention)
- people boosts: Priority list +big, Watch +small, Avoid = filtered (see `brand/people.md`)
