# Content Engine — Turn Signals into Posts

Signals tagged `CONTENT` (plus Arina's own ideas) become drafts: **text posts, photos, carousels**. No video in v1.

## Inputs every draft is grounded in

1. The signal (what's happening + suggested angle from scoring)
2. `brand/character.md` — facts, stories, proof points (never invent biography)
3. `brand/tone-of-voice.md` — voice rules + calibration posts
4. `brand/messaging.md` — pillar the post serves + POV statements
5. **Arina's skills** — her Claude Code skills plug in as specialized generators/reviewers
   > ⚠️ Skill list TBD — Arina will send them. Each skill gets a row here when integrated:

   | Skill | Role in pipeline | Status |
   |---|---|---|
   | _(awaiting)_ | | |

## Formats

### Text posts
- LinkedIn long-form + X short-form generated as **two separate drafts** from one angle (not a copy-paste)
- Hook-first: 3 hook options per draft, Arina picks

### Photos
- v1 = AI-generated images + real screenshots
- Each photo draft = image prompt + caption; image model TBD (depends on API keys)
- Screenshot-type posts (results, dashboards) flagged for Arina to capture the real thing

### Carousels
- 6–10 slides: hook slide → value slides → CTA slide
- Output: slide-by-slide copy + layout notes → rendered to PDF (LinkedIn) / 4-image set (X)
- Renderer TBD (HTML→PDF template or design-tool API)

## Daily briefing format (the unit of the Today page)

Every draft surfaced in the morning briefing carries four things (modeled on the Hype "Founder Engine" template Arina referenced):
1. **Topic** — what this post is about, one line
2. **Draft** — the full post (hook options + body)
3. **Rationale ("why now")** — why this is worth posting today: which bet it tests, what trend/Priority account it rides, which cadence slot it fills
4. **Engagement hook** — the specific mechanism for pulling responses (open question, quote-tweet, slide-6 prompt)

The Today page groups these by channel (X / LinkedIn) so Arina sees her two feeds separately. Goal framing: "turn 20 minutes into ~5 posts/week" — she picks what to write, the system handles what to say.

## Draft lifecycle

```
IDEA → DRAFTED → (voice check) → IN_REVIEW → APPROVED → SCHEDULED → PUBLISHED → MEASURED
```

### Voice check (automatic gate before Arina sees anything)
A second Claude pass scores the draft against `tone-of-voice.md`: banned phrases, sentence mechanics, AI-tells. Fails → auto-revise once → still fails → flag "voice unverified".

## Publishing (v1)

- X: via API if posting key provided; else copy-button in app
- LinkedIn: copy-button + reminder notification (API posting restricted — see `channels/linkedin.md`)
- Scheduling: best-time defaults per channel, refined by analytics

## Cadence targets (draft — confirm with Arina)

- LinkedIn: 3–4/week (1 carousel, 2–3 text/photo)
- X: 1–2/day + replies
- Repurposing rule: every carousel → 1 X thread; every strong X post → LinkedIn expansion
