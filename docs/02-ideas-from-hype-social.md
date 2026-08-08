# Ideas from hype-social (Prateek's repo)

Source: https://github.com/prateeksinghahlawat/hype-social — reviewed 2026-06-10.
His system: multi-client AI marketing engine for solo SMMs (Next.js + Neon + 6 LLM "skills" + per-client YAML configs). Ours: single-person personal brand. Different scale, but several of his patterns are directly stealable.

## Steal — add to our structure

### 1. Hypothesis lifecycle in strategy (his best idea)
His `strategy.yaml` tracks `active_hypotheses → promoted_patterns / retired_hypotheses`. Content strategy is run as explicit experiments: "carousels about X outperform" is a hypothesis with a status, not a vibe. Promotion/retirement happens through the analytics loop.
→ **Add to `brand/messaging.md`**: an `Active hypotheses` section (id, hypothesis, evidence so far, status). Analytics weekly digest proposes promote/retire.

### 2. Lane ladder — topic safety rails
Per-tweet 3-tier check before engaging: **Tier 2 in-lane** (full engage) / **Tier 1 adjacent** (engage only at pattern level, with explicit caveat in the rationale) / **Tier 0 hard-skip** (politics, partisan drama, doom/hype maximalism, scandals — even a smart reply puts you in the wrong 48h conversation chain).
Plus two "trap" rules: **Trap A** — on-topic content from a politically-coded author → track, don't engage (same point will resurface from a cleaner host). **Trap B** — cultural-commentary tweets where the natural reply tone turns condescending → skip.
→ **Add to `brand/messaging.md`** (lanes per pillar) and **`pipeline/01-signals.md`** (lane check as a scoring dimension). For a personal brand this is reputation insurance.

### 3. The angle IS the deliverable
His listener doesn't say "look at this tweet" — every candidate ships with a **paste-ready, voice-aware, single-line angle** the human posts with light edit. No second drafting step for replies.
→ **Upgrade `pipeline/01-signals.md` + `02-contacts.md`**: every REPLY/CONTACT signal must carry a ship-ready line, not a suggestion to write one. The iOS Review screen becomes "edit lightly + paste", not "now go write".

### 4. KOL list as its own structured file with tiers
He separates the *listening universe* from strategy: `kol_list.yaml` with **KOLs** (tier 1: engage within hours / tier 2: monitor + amplify / tier 3: ambient), **competitors** (their own engagement tiers: support good moves / call out egregious ones / default skip), and **do_not_surface** blocklist.
→ **New file `brand/kol-list.md`** replacing the thin "target accounts" table in `channels/x.md`. Feeds both signal scoring and the trap rules.

### 5. Suggestion queue — the system never edits brand files directly
His self-improvement loop: chat notes accumulate in an audit log → after ≥5 notes (+24h cooldown) an "evolution" run compares notes vs. actual performance → proposes a **config diff** into a suggestions queue → human approves → next run reads the updated config. Skills *propose*, never write.
→ **Add to `pipeline/04-analytics.md` + `data/schema.md`**: a `suggestions` table + a Suggestions screen section in the iOS app. The weekly digest stops being a report and becomes a queue of approvable diffs to `brand/*.md` (new banned phrase, retire a hook style, adjust pillar mix). Also steal the **note-taking habit**: a quick "record note" action in the app ("my audience hates threads lately") that feeds evolution.

### 6. Flagger — operational hygiene checks
Daily narrow checks: queued draft contains a banned phrase, no post scheduled today, approval was accepted but never applied, config drift. Crucially: flagger reads **ground truth only**, never synthesized reports (prevents hallucination loops).
→ **Add a `flags` concept to `pipeline/04-analytics.md`** + `flags` table in schema. Maps to push notifications in the iOS app ("nothing scheduled for tomorrow").

### 7. Status fates are history + signal expiry
Engaged/dismissed/acted-on rows survive every refresh (they're history, used for dedup); pending cards expire (his: 12h) and never block re-surfacing. New batches only displace old ones if quality is comparable ("atomic swap with quality gate").
→ **`data/schema.md`**: add `expires_at` to signals, never delete decided rows, dedup only against *decided* rows.

### 8. Code-enforced daily caps
QRT cap of 3/day enforced in code, not in the prompt (counts existing, demotes extras to replies).
→ We already planned caps in `02-contacts.md` — make them **code-enforced in the worker**, not prompt-suggested.

## Adapt — good idea, different shape for us

- **Voice/messaging/drafts file split with writability rules.** His configs declare per-section `writable: edit_allowed | append_only` + provenance on every value. Full YAML schema is overkill for one person, but steal: (a) `voice_evolutions` / `messaging_evolutions` **append-only changelog sections** at the bottom of our brand files, (b) explicit `signature_patterns` and `we_avoid` *with worked examples* (do this / never this), (c) `register_by_platform` — one voice, modulated per channel (already sketched in tone-of-voice.md, his structure is more rigorous).
- **Reporter cadence**: weekly + monthly + per-campaign retrospective, each comparing to the previous period. We only had weekly — add monthly rollup + a retrospective template for big moments (launch, viral post, event).
- **Graceful degradation**: every skill runs with whatever API keys exist, logs what it skipped. Adopt as a worker principle in `integrations/apis.md`.
- **Layer model**: ground truth → detection → synthesis, strictly one direction; raw surfaces never JOINed. Adopt as an architecture principle (his rule exists because mixing planned vs. actual data created garbage).

## Skip — exists for his context, not ours

- Multi-client onboarding (8-question seeding, per-client kill switches) — we have exactly one "client": Arina.
- Notion calendar sync, Slack Lists, ClickUp integration — his agency stack.
- Kaito MCP as sole X source — we already have TwitterAPI.io; Kaito is optional later (Arina has access via work, but this system should stay personal — see memory rule about hype infra).
- Gemini as default LLM — we're Claude-native.
- `autoresearch` meta-skill (hill-climbs skill prompts) — fun, premature for v1.

## ✅ Applied 2026-06-10 — personal edition

Arina asked for a simplified, personal-brand version (not the agency machinery). What was actually applied:

| Idea | Personal version applied | File |
|---|---|---|
| Hypothesis lifecycle | "What I'm testing right now" — max 3 simple bets, each ends as proven / didn't work | `brand/messaging.md` |
| Lane ladder + traps | 3 plain lists (my lane / adjacent / never) + 2 rules: skip drama-coded authors, skip if reply sounds like lecturing | `brand/messaging.md`, `pipeline/01-signals.md` |
| Ship-ready angle | Every REPLY/CONTACT signal must carry a paste-ready line, or it's a SKIP | `pipeline/01-signals.md` |
| KOL list | `brand/people.md` — three lists: Priority ⭐ / Watch 👀 / Avoid 🚫, no engagement-model tiers | `brand/people.md` (new) |
| Suggestions queue | Weekly digest ends with one-tap approvable proposals; system never edits brand files itself. No audit log, no cooldowns | `pipeline/04-analytics.md`, `data/schema.md` |
| Record-note | One text field in the app for quick observations → raw material for next week's suggestions | `pipeline/04-analytics.md` |
| Flagger | Cut to 3 checks: banned phrase in scheduled draft, empty calendar tomorrow, source down 2+ days | `pipeline/04-analytics.md`, `data/schema.md` |
| Signal expiry + history | `expires_at` (24h) on signals; decided rows kept forever for dedup | `data/schema.md`, `pipeline/01-signals.md` |
| Code-enforced caps | Noted that daily contact caps live in worker code, not prompts | `pipeline/02-contacts.md` |
| Evolutions changelog | Single append-only "Voice changelog" section | `brand/tone-of-voice.md` |

Deliberately NOT applied (too much for one person): monthly reports & retrospectives (weekly digest is enough), per-section writability schemas, provenance tracking on every value, atomic-swap quality gates, QRT tier rules, autoresearch.
