# Request Log & Decisions

Running log of what Arina asked for and what was decided. Newest entries at the bottom.

---

## 2026-06-10 — Founding request (verbatim intent, cleaned from voice note)

Arina wants an **iOS application for her personal brand**. Core ideas from her request:

- **Find new signals** → use them to **create contacts** (outreach targets) for **LinkedIn** and **X** (these two channels for now).
- **Create content**: text posts, **photos** (not videos for now), and possibly **carousels**.
- She will provide **several API keys** to connect later.
- Right now she needs the **back structure** — how everything is going to look: architecture, MD files for each part of work. **No frontend yet** — just a mind-map / diagram of the structure.
- MD files needed for: **her character**, **tone of voice**, **messaging**, **LinkedIn stats**, **X stats**.
- Every piece of work must produce/update an MD file so context is never lost.
- This request itself must be saved as an MD file (this file).
- She is currently recording a **personal interview**; once she sends it, it becomes the source of truth for how/what to write (fills the `brand/` files).
- Claude may choose the **language/stack**. Database will be **Supabase** in the end — for now just the schema/structure.
- **Analytics is important** — must be part of the system.
- She has **skills** (Claude Code skills) she will send to plug into the system.
- Overall goal: one system ("the whole ship") that boosts her personal brand.

## 2026-06-10 — Decisions made in Phase 0

| Decision | Choice | Why |
|---|---|---|
| Stack | iOS client (SwiftUI) + Supabase (Postgres, Auth, Edge Functions) + Python worker for AI/scraping jobs | Supabase confirmed by Arina; Python matches her existing tooling (job-agent, PR analytics stack); iOS app stays a thin client |
| Repo layout | Docs-first, one MD per work area | Her explicit requirement |
| Channels v1 | LinkedIn + X only | Her explicit scope |
| Content v1 | Text, photos, carousels. No video | Her explicit scope |
| Secrets | Env vars / Supabase secrets only, never in MD files or YAML | Same convention as job-agent |

## 2026-06-10 — Reviewed Prateek's hype-social repo

Arina shared https://github.com/prateeksinghahlawat/hype-social (colleague's multi-client AI marketing engine) and asked for ideas to add to our structure. Full analysis in `docs/02-ideas-from-hype-social.md`. Headline steals: hypothesis lifecycle, lane ladder + trap rules, ship-ready angles, KOL list file, suggestions queue (system proposes brand-file changes, human approves), flags, signal expiry.

Arina then asked to apply them **simplified for a personal brand, nothing advanced** → applied same day: bets section + lanes in `brand/messaging.md`, new `brand/people.md` (Priority/Watch/Avoid), paste-ready angle rule + 24h signal expiry in `pipeline/01-signals.md`, suggestions + quick notes + 3 hygiene flags in `pipeline/04-analytics.md`, 4 small tables in `data/schema.md`, voice changelog in `brand/tone-of-voice.md`. Dropped as too heavy: monthly reports, provenance tracking, writability schemas, QRT tiers, autoresearch.

## 2026-06-10 — Skills repo + "what else is needed"

Arina shared https://github.com/hyperfx-ai/marketing-skills and asked what else is needed besides the interview. Reviewed: all 20 skills depend on the Hyper MCP platform — adopt 4 (`linkedin` incl. text-to-carousel, `image-generation`, `youtube-transcript`, `competitor-intel`), skip the ads/email/SEO ones. Plan in `integrations/skills.md`; key open decision = trial Hyper MCP for LinkedIn publishing vs copy-button. Full prioritized list of remaining inputs written to `docs/03-inputs-checklist.md` (posts-she-likes calibration set and seed people list are the underrated ones).

## 2026-06-10 — Second skills repo (coreyhaines31/marketingskills)

Reviewed: 44 pure-knowledge skills, no platform dependency (unlike hyperfx's Hyper MCP ones) — the two repos complement: Corey's = brains, hyperfx's = hands. Adopt 6: `social`, `copy-editing` (powers our voice-check gate), `copywriting`, `content-strategy`, `marketing-psychology`, `marketing-ideas`. Their "shared product-marketing.md context" pattern = our `brand/` folder. Updated `integrations/skills.md`.

## 2026-06-10 — Third skills repo (ComposioHQ/awesome-claude-skills)

General-purpose grab-bag, not marketing-specific. Adopt 2: `twitter-algorithm-optimizer` (final ranking pass on X drafts, based on 2023 algorithm dump — heuristics not gospel) and `canvas-design` (candidate carousel renderer — fills our "renderer TBD" gap). Skills inventory in `integrations/skills.md` now final pending Arina's own skills.

## 2026-06-12 — Interview Q1–26 received (Arina lost her voice mid-interview)

First 26 of 100 interview questions arrived as a transcript. Distilled into `docs/04-interview-q1-26.md`; brand files upgraded from template to **v0.5**: character.md (border-crosser spine, how-her-mind-works, AI boundaries, music & art), tone-of-voice.md (Fei-Fei Li north star, "plain sentence one expensive word", em-dash hard ban, closing/opening rules, humor rules, banned moves), messaging.md (4 POV statements in her words, personal lane confirmed as pillar 4).

Still open from the interview itself: Q26 unanswered (dignity = value or fear?), her signature opening move (Q15 "I don't know yet"), and crucially — **zero verbatim post examples surfaced in 26 questions**; the calibration set in tone-of-voice.md is still empty.

## 2026-06-12 — Frontend/design direction started

Arina shared the "lazygirl collective" brand board (burgundy/pink/baby-blue/cream, editorial serif) as her reference. Verdict: strong fit with her brand (classical craft, warm humor, anti-tech-dashboard differentiation); one adjustment — lead editorial (ink-on-paper) rather than pink-first. Tokens, typography plan (New York serif free now, Editors Note later; DM Sans for UI), screen styles, and carousel double-duty written to `design/01-visual-direction.md`. Today-screen mockup rendered in chat. Open: monogram logo yes/no, wordmark on carousels, success-green token.

## 2026-06-12 — Platform pivot: iOS → web app

Arina decided the frontend is a **web app**, not iOS. Consequences: stack becomes Next.js + Vercel (she already deploys there) + Supabase; no Apple Developer account needed; "iOS app" in all docs now reads "web app". Design direction unchanged (lazygirl palette) with one upgrade: on the web we can use a real editorial Google Font (Fraunces) instead of Apple's New York. Frontend prototype scaffolded in `web/` with mock data (Today / Review / Stats).

## 2026-06-12 — Prototype extended to full feature coverage

Arina flagged that the 3-screen prototype did not show everything designed in the backend docs. Correct: v1 scoped to Today/Review/Stats per architecture doc. Extended to 5 screens: **Contacts** (outreach queue with lifecycle DRAFTED→APPROVED→SENT→REPLIED, daily caps chips, copy-opener flow per `pipeline/02-contacts.md`) and **Brand** (read-only rulebook: bets with statuses, lanes, people lists per `brand/*.md`), plus quick-note box on Today (per `pipeline/04-analytics.md`). Features that remain backend-only by nature (no UI): cron ingestion, dedup, heuristic+Claude scoring, 24h expiry, voice-check generation, weekly digest job. Build passes, all 6 routes static.

## 2026-06-12 — Design elevation (gradient/glass/sparkle pass)

Arina shared gradient-shape and foil-texture references and asked to elevate the flat design: better buttons, glitter, shadows. Added a depth layer in the existing palette: gradient blobs behind content, 3.5% grain overlay, frosted-glass cards, gradient glow buttons with hover lift, twinkle sparkles, gradient pillar bars and quote blocks. Documented in `design/01-visual-direction.md` → "Depth layer". One bug fixed along the way: unencoded SVG data URI broke the stylesheet (buttons lost fill); URL-encoded fix. Build green.

## 2026-06-19 — Today page restructured into a morning-briefing dashboard

Arina shared the Hype "Founder Content Engine" proposal (GenLabs/Ofir) — same product shape — and asked to restructure Today into one dashboard: (1) ready-to-post drafts divided by channel (X / LinkedIn), (2) a compact stats strip in the middle, (3) the engageable feed of tweets/LinkedIn posts at the bottom. Implemented: new `BriefingDraft` component carrying the briefing template (topic / draft / "why now" rationale / engagement hook) per the reference; drafts grouped by channel in two columns; week-summary strip (posts vs target, followers, top reach) linking to full Stats; signals feed kept as "Worth engaging". Added the daily-briefing format spec to `pipeline/03-content.md`. Review/Stats/Contacts/Brand tabs unchanged as deeper views. Build green.

## 2026-06-19 — Stats rebuilt around full platform metrics + metrics-based funnel

Arina asked to surface all X + LinkedIn metrics in Stats and base the marketing funnel on them. Done: two per-platform metric panels (LinkedIn: impressions, unique views, eng rate, reactions, comments, reposts, post clicks, profile views, search appearances, SSI; X: impressions, eng rate, likes, replies, reposts, quotes, bookmarks, profile visits, link clicks, mentions). New 6-stage marketing funnel built from those numbers (Reach→Engaged→Profile visits→New followers→Conversations→Opportunities) with conversion % between stages, replacing the old standalone contact funnel. Spec added to `pipeline/04-analytics.md`. Build green. Note: hit a collapsed preview-browser viewport (winW=15px) that made screenshots blank and inflated layout measurements — resolved by restarting the preview server, not a CSS bug.

## 2026-06-19 — Finished the frontend screens (Arina's pick)

Built the three remaining frontend pieces: (1) **Calendar** (`/calendar`) — week view with scheduled posts by time/channel, draft badges, today highlight, cadence chips, empty-day prompts; (2) **Real Edit flows** — Edit now opens an inline editable textarea on signal angles (Today) and draft bodies (Review), toggling Edit↔Done; (3) **Editable Brand** — bets cycle status on tap, lanes and people lists add/remove in-app. Nav now 6 tabs, fits at 820px. All local state (no persistence until backend). Build green, all 7 routes. Roadmap updated — frontend shell now feature-complete for a single-user prototype; remaining frontend items (carousel renderer, persistence, Vercel deploy) depend on backend or are the renderer decision. Recurring preview-viewport collapse (winW drops to ~15px) worked around with explicit resize.

## 2026-06-19 — Softened Meltwater references + Brand strategy sections

Arina felt shy showing the Meltwater/$12k brag in example posts. Reworked all example content to keep the build-vs-buy principle but drop the brand name, exact figures, and boastful framing (LinkedIn draft, contact opener, signal angle, top-post title). Added four read-only strategy sections to the Brand page above the editable lists: **Positioning** (border-crosser), **Tone of voice** (Fei-Fei Li north star, plain-surface-deep-engine formula, the rules incl. em-dash ban), **Messaging** (4 pillars with % + 4 POV statements), **Personas to target** (3: Web3 founders/CMOs, marketers leveling up on AI, technical founders/builders — each with who + what they should believe + pillar fit). Sourced from brand/*.md. Build green.

## 2026-06-19 — SocialCrawl added as primary signal source

Arina shared SocialCrawl (skill `npx skills add socialcrawl/skills` + MCP config + API key). It's a unified API across 42 platforms incl. X, LinkedIn, Reddit, news/search, with scheduled Monitors (webhooks). Decision: make it the **primary signal source** — covers X + LinkedIn + news in one, closes the LinkedIn-reading gap, and Monitors can drive ingestion. Key stored in gitignored `web/.env.local`; documented (by name) in `integrations/apis.md` + `pipeline/01-signals.md`. TwitterAPI.io demoted to X own-post analytics + backup. ⚠️ Key was pasted in plaintext chat → flagged for rotation. Open decision: connect SocialCrawl as a live MCP server now (to pull real signals and start replacing mock data) vs wait for the backend.

## 2026-06-19 — Backend started: real SocialCrawl signal pipeline live

Architecture decision locked: **Next.js-native backend** (route handlers + server functions + Vercel Cron), not a Python worker. Built and verified end-to-end:
- `lib/socialcrawl.ts` — direct API client (`x-api-key`, `/v1/search/everywhere`) + normalizer
- `lib/brand-config.ts` + `lib/scoring.ts` — heuristic scorer (keyword/lane/pillar/action), free, no AI
- `lib/signals.ts` — server loader (reads cached seed; `refreshSignals()` does live pull)
- `app/api/signals/route.ts` — GET seed; `?refresh=1` live (20 credits)
- Today "Worth engaging" feed now renders **real SocialCrawl posts**, scored + lane-filtered, with "Open post" links + a "live · SocialCrawl" badge. `SignalCard` got a real-data variant (no Claude angle yet → shows why-it-surfaced + open-post + draft-angle-placeholder).

Verified: API returns real scored signals (Tavily, Instagram @soravjain, YouTube, Hacker News), Today renders 8 cards. Build green. SocialCrawl credits: 21 used (1 test + 20 search), 79 left; app reads seed so no per-load spend.

Next unlocks need Arina: Supabase project (persistence), `ANTHROPIC_API_KEY` in `web/.env.local` (Claude scoring → voice-matched angles + drafting), rotate the SocialCrawl key.

## 2026-06-19 — Provider-agnostic LLM adapter built (Claude + Nous)

Arina considered Hermes/Nous; clarified that Hermes Agent is a desktop app (not embeddable) and "multiple agents" = prompt roles the backend sequences. She chose a provider-agnostic adapter. Built `web/lib/llm/` (types, config, claude via Anthropic SDK with `claude-opus-4-8` + adaptive thinking + structured outputs, nous OpenAI-compatible, index router with fallback). Per-role routing: voice work → Claude, bulk scoring → Nous, all env-overridable. First consumer: `draft-angle` (drafter role) wired to the "Draft angle" button on real signal cards + `/api/draft-angle`. `/api/llm-status` verifies wiring tokenlessly. Verified end-to-end: adapter reaches the real Claude API (auth + request shape valid) — only blocker is the shell ANTHROPIC_API_KEY has no credits. Spec in `docs/06-llm-layer.md`. Build green. Needs: a funded ANTHROPIC_API_KEY (or NOUS_PORTAL_API_KEY) in `web/.env.local`.

## 2026-06-19 — Advisor flow added (university partner project, 3h build)

Arina pivoted a variant for a university partner project: a multi-user brand advisor. Person enters socials (LinkedIn/IG/X/other) + focus/goals + a 10-question intake (condensed 100Q: tone, positioning, messaging, services, goals) → gets audience read + focus recommendations + sample posts. Built `/advisor` (single-page form + inline results), `lib/advisor.ts` (types, 10 questions, structured-output schema, `analyzeIntake` via the LLM adapter, graceful `demoResult` fallback), `/api/advisor`. Added "Advisor" as first nav item. Verified: form renders, POST returns structured result. Runs in demo mode until a funded key is set (shell ANTHROPIC key is unfunded). Spec: `docs/07-advisor.md`. Build green.

## 2026-06-19 — Supabase persistence wired (Advisor submissions)

Installed `@supabase/supabase-js`; added `lib/supabase.ts` (server-only client via SUPABASE_URL + SUPABASE_API_KEY secret key, bypasses RLS). `/api/advisor` now best-effort-inserts each submission (name, socials, focus, questionnaire, result, demo flag) into `advisor_submissions` — never blocks the response. Table SQL: `web/supabase/advisor.sql` (RLS on, private to the secret key). Build green. **Blocked on Arina: add `SUPABASE_URL=https://<ref>.supabase.co` to `web/.env.local` and run `web/supabase/advisor.sql` in the Supabase SQL editor.** The secret key is already in .env.local; it's server-only (never expose client-side).

## 2026-06-19 — Supabase LIVE ✅

Arina added SUPABASE_URL (kzidbkiasfbzirbttitd) and ran `advisor.sql`. Verified end-to-end: submitting through the real `/api/advisor` saves the row to `advisor_submissions` (confirmed "Sofia Marín" landed via PostgREST query). Auth + connection + table all working. Persistence is live for the Advisor flow; the same `getSupabase()` client is ready to persist the rest of the app (signals/drafts/contacts) when we do the broader Phase-1 migration.

## 2026-06-19 — Restructure: advisor-driven dashboard + building screen

Pivoted the app so the whole dashboard is generated from the Advisor submission (not Arina's personal data). Flow: `/advisor` (socials + 10Q) → submit saves to Supabase → `/building` (animated "building your brand" intermediate) → `/` Today, now a morning briefing built from the latest submission. `lib/active-brand.ts` reads the most recent `advisor_submissions` row; Today / Brand / Calendar / Contacts all render from it (greeting + positioning + sample posts + focus; audience segments as contacts; sample posts scheduled across the week). Empty state (`EmptyBrand`) points to the Advisor when no submission. Nav trimmed to Advisor · Today · Calendar · Contacts · Brand (dropped Review/Stats, the old personal-OS screens). Verified live: Today shows "Good morning, Sofia" from the Supabase row; Contacts shows her segments. Build green. Runs in demo mode until a funded LLM key is added. Spec: `docs/07-advisor.md`.

Env checklist for full run: SUPABASE_URL ✅, SUPABASE_API_KEY ✅, SOCIALCRAWL_API_KEY ✅ (signals only, not used by advisor yet); ADD a funded ANTHROPIC_API_KEY (or NOUS_PORTAL_API_KEY) to leave demo mode. Optional/requested: GEMINI_API_KEY, PERPLEXITY_API_KEY (not yet wired — offered).

## 2026-06-19 — Gemini + Perplexity wired; funded key live; building-screen UX fix

Arina added CLAUDE_API_KEY/GEMINI_API_KEY/PERPLEXITY_API_KEY. Fixes/adds: claude.ts now accepts ANTHROPIC_API_KEY *or* CLAUDE_API_KEY; added Gemini as a 3rd LLM provider (`lib/llm/gemini.ts`, default gemini-2.0-flash) with router + status support; added Perplexity live research (`lib/research.ts`, model sonar) that grounds the advisor analysis (called in `/api/advisor`, best-effort). Verified live: `/api/llm-status` shows claude+gemini+perplexity true; real advisor submissions come back non-demo, personalized, grounded (e.g. positioning reflecting a "40-person support team"), voice rules followed, no em-dashes. UX: moved the analysis onto the `/building` screen (advisor stashes intake in sessionStorage → building runs the POST while its animation plays → redirects to Today), so the ~36s analysis is covered by the animation instead of a disabled button. Build green.

## 2026-06-19 — Contacts: "Find real people" via SocialCrawl

Wired SocialCrawl to turn audience segments into real people on the Contacts page. Constraint discovered: SocialCrawl has NO LinkedIn people-search endpoint (only `/v1/linkedin/profile?url=`); LinkedIn blocks open discovery. Solution: use `/v1/search/everywhere` (which includes `linkedin` as a source) and surface LinkedIn hits first, then other socials. `lib/find-people.ts` extracts people (name + url, dedup), `/api/find-people` (POST query), `components/SegmentFinder.tsx` adds a per-segment "Find real people" button (on-demand → credit-controlled). Verified: returns 8 real people, LinkedIn profiles first, clickable. Cost: ~20 SocialCrawl credits per search; **39 credits remaining**. Note: results mix individuals + companies (open search); LinkedIn URLs are often feed/activity links to the person's post.

## 2026-06-19 — "Why this works" per post, grounded in marketing frameworks

Added a `why` field to sample posts. `advisor.ts` SYSTEM now embeds direct-response frameworks (hook/pattern-interrupt, PAS, story-then-lesson, open loops, social proof, widening close) and requires each post's `why` to explain what makes it work + name the framework. Schema + type + demoResult + intake prompt updated (`why` optional in type for backward compat with pre-existing rows). Shown in the expanded CalendarPost and on Today's BrandPost as a "why this works" callout. Verified: real posts return `why` naming the exact framework (story-then-lesson, PAS, open loop, show-don't-tell). Note: brands generated before this (Allie) lack `why` — re-run to populate. Also made calendar posts click-to-expand (full hook+body+copy) earlier.

Open follow-ups Arina proposed: (1) ingest her downloaded GitHub marketing skill files to further ground generation (needs the file path); (2) Gemini image/carousel generation for reference visuals (feasible via Gemini 2.5 Flash Image — next build).

## 2026-06-19 — Two things: Corey Haines marketing skills + Gemini images

(1) **Marketing skills grounding**: distilled coreyhaines31/marketingskills (social, copywriting, marketing-psychology) into `lib/marketing-playbook.ts` — hook formulas (Curiosity/Story/Value/Contrarian), copy principles, JTBD/social-proof/loss-aversion, 5 carousel architectures. Injected into the advisor SYSTEM so posts + `why` name the actual framework used. Verified.
(2) **Gemini reference images**: `gemini-2.5-flash-image` confirmed working with the key; `lib/image-gen.ts` + `/api/generate-image` (returns a data: URL) + a "Reference image" button on Today's BrandPost cards (generate → show inline → download). Verified end-to-end (real PNG returned, ~1.3MB). ~10-20s per image.

## 2026-06-19 — Multi-slide carousels (editorial template style)

Reference: Jelena Burcer content-template carousels (white/editorial, big serif headline, subhead, bottom takeaway) — couldn't fetch (LinkedIn auth), matched from Arina's screenshot. Built: `lib/carousel.ts` (LLM structured output → architecture + slides, grounded in the 5 carousel architectures from the marketing playbook + Corey's frameworks), `/api/carousel`, `components/Carousel.tsx` (designed cream/serif slides with REAL text — not AI-text-images — horizontal scroll, per-slide PNG download via html-to-image). "Make carousel" button added to Today's BrandPost cards (tone passed from the brand). Verified: 8-slide Problem-Proof carousel, one idea per slide, cover+points+CTA, on-tone, no em-dashes. ~15-25s per carousel.

## 2026-06-19 — Brand Playbook (skills-grounded) + better image prompt

(1) **Playbook**: new `/playbook` tab. `lib/brand-guide-skills.ts` distills Corey's social/content-strategy/public-relations/community methodology; `lib/playbook.ts` generates a 6-section personalized guide (Foundation, Socials, What to create, PR/earned media, Community, First 30 days) grounded in the skills + the person's brand; `/api/playbook` (reads active brand) + `PlaybookView` (generate button, renders sections). Verified: deeply personalized to Allie, uses her pillars/audience, cites Corey's methods (searchable/shareable, PR owned/inbound/proactive, HARO/Qwoted, hook rotation, 5+ replies/day). (2) **Images**: reworked the Gemini prompt from "abstract/conceptual" (looked ugly) to art-directed "magazine editorial, one strong subject, natural light, cream/burgundy palette, no text" — click Regenerate to see the new style.

## 2026-06-19 — PDF export + lightweight accounts (email identity)

(1) **PDF**: `components/DownloadPdf.tsx` (jsPDF) → "Download PDF" button on Brand page; exports the full brand plan (positioning, tone, audience, pillars, recommendations, sample posts + why). Client-side, instant.
(2) **Accounts (email identity, cookie-based)**: Advisor now has an email field (= your account); on submit the route saves `email` and sets a `pb_email` cookie so the dashboard auto-loads that person's brand on return. `getActiveBrand` filters by the cookie's email. Returning-user "enter your email to load" + "New person? Start fresh" (clears cookie) on the Advisor. `/api/signin` (POST set cookie, DELETE clear). **Graceful pre-migration fallback**: if the `email` column doesn't exist, insert retries without it and getActiveBrand falls back to latest — so nothing breaks before the migration. **Arina must run one line** (in `web/supabase/advisor.sql`): `alter table advisor_submissions add column if not exists email text;` to activate true per-person accounts. Build green.

## Open items (waiting on Arina)

- [ ] Interview Q27–100 → finishes `brand/*.md` (goals, audience, off-limits topics, wins/failures)
- [ ] **Calibration set: 5–10 real posts pasted verbatim** → `brand/tone-of-voice.md` (interview produced rules but no examples)
- [ ] API keys list → `integrations/apis.md`
- [ ] Skills to integrate → `pipeline/03-content.md`
- [ ] Baseline LinkedIn / X stats → `channels/linkedin.md`, `channels/x.md`
- [ ] 10–20 seed handles for `brand/people.md` (Priority / Watch / Avoid)
- [ ] Confirm: should outreach (DMs/connection requests) be drafted-only or auto-sent? (Recommendation: drafted-only, human approves in app)
