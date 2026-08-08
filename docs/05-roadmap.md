# Roadmap — What's Left to Build

Status as of 2026-06-19. The frontend is a complete clickable shell on **mock data**. The backend that makes it real does not exist yet. This file is the running gap list.

## Where things stand

| Area | State |
|---|---|
| Docs & architecture | ✅ done |
| Brand files | 🟡 v0.5 (interview Q1–26; calibration set empty) |
| Design system | ✅ done (palette, depth layer) |
| Web app — 5 screens | ✅ UI done, ❌ all mock data |
| Backend / engine | ❌ not started |
| Integrations | ❌ not started |
| Deploy | ❌ runs locally only |

## Bucket 1 — Make it real (the engine)

Architecture: **Next.js-native** (route handlers + server functions + Vercel Cron), SocialCrawl direct API, Supabase for persistence, Claude for scoring/drafting.

1. **Supabase project** — create it (needs Arina's account), run `data/schema.md` as migrations
2. **Auth** — single-user login (just Arina)
3. **Wire frontend to Supabase** — replace mock imports with live reads (signals already real; rest pending)
4. ✅ **Signal ingestion** — SocialCrawl `/v1/search/everywhere` → `lib/socialcrawl.ts` normalize. Live; reads cached seed (`data/signals-seed.json`), `/api/signals?refresh=1` does a live 20-credit pull
5. 🟡 **Scoring** — ✅ heuristic done (`lib/scoring.ts`, brand-config driven, lane check). Claude evaluation (voice-matched angle) still to add — **needs `ANTHROPIC_API_KEY`**
6. 🟡 **Content drafting** — provider-agnostic LLM adapter built (`lib/llm/`, Claude+Nous, `docs/06-llm-layer.md`); `draft-angle` consumer + "Draft angle" button live. Verified reaching Claude API — **needs a funded `ANTHROPIC_API_KEY` or `NOUS_PORTAL_API_KEY`**. Full briefing-draft generation still to add.
7. **Voice-check gate** — adapter ready (voice_check role); needs funded key + calibration set
8. **Contact openers** — adapter ready (contact role); needs funded key
9. **Metrics pull** — X own-post via TwitterAPI.io; LinkedIn via SocialCrawl/export → Stats + funnel
10. **Weekly digest + suggestions** — the learning loop
11. **Daily flags** — banned phrase, empty calendar, source down

**Real today:** the Today "Worth engaging" feed shows live SocialCrawl posts, heuristically scored and lane-filtered, with "Open post" links. Persistence (Supabase) and voice-matched angles (Claude) are the next two unlocks.

**Blocked on Arina:** Supabase project creds, an `ANTHROPIC_API_KEY` for the web app's env (`web/.env.local`), and rotating the SocialCrawl key.

## Bucket 2 — Frontend gaps

- ✅ **Calendar / scheduling view** — built (`/calendar`): week rows, posts by time/channel, draft badges, today highlight, empty-day prompts, cadence chips. Post rows are clickable → forward to Review (drafts)
- ✅ **Real Edit flows** — built: Edit on signal angles (Today) and draft bodies (Review) now opens an inline textarea, button toggles Edit↔Done
- ✅ **Editable Brand** — built: bets cycle status on tap, lanes add/remove, people add/remove (local state)
- **Carousel renderer + preview** — still TBD (canvas-design skill vs Hyper MCP)
- **Persist edits / notes / approvals** — all still local state; needs the backend to save
- **Deploy to Vercel** — so it's usable on her phone and shareable

The frontend shell is now feature-complete for a single-user prototype. Everything left in this bucket depends on Bucket 1 (persistence) or is the carousel renderer.

## Bucket 3 — Integrations (decisions + wiring)

- **Hyper MCP decision** — LinkedIn publishing + image gen, or build direct APIs (see `integrations/skills.md`)
- **Install the 12 chosen skills** — 6 Corey + 4 hyperfx + 2 Composio
- **Image generation** — for photo posts
- **Scheduling tool** — Typefully/Buffer connection (from the GenLabs reference)
- **Slack briefing delivery** — optional: push the morning briefing into Slack (the GenLabs "Founder Engine" pattern)

## Bucket 4 — Inputs still needed from Arina (see `docs/03-inputs-checklist.md`)

- Interview Q27–100
- **5–10 real posts** for the voice calibration set ← highest leverage, unblocks real drafting quality
- Seed people list (10–20 handles)
- Baseline LinkedIn/X stats
- API keys
- Her own skills

## Suggested order

**Phase 1 (make one slice real):** Supabase + auth + wire Stats to a real table + X metrics pull. Proves the whole pipe end-to-end on the simplest data.
**Phase 2:** signal ingestion + scoring → real Today feed.
**Phase 3:** drafting + voice check → real briefing drafts (needs calibration set).
**Phase 4:** weekly digest, flags, calendar, publishing integration.
