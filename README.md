# Personal Brand OS

An iOS-first system that finds **signals** (trending conversations, relevant people, news), turns them into **contacts** (outreach on LinkedIn / X) and **content** (text posts, photos, carousels), and tracks everything with **analytics**.

Owner: Arina Nesterenko (marketing/GTM, Web3/B2B/SaaS)
Status: **Phase 0 — structure & docs.** No code, no frontend yet. Awaiting personal interview + API keys + skills from Arina.

## How this repo works

Every part of the work gets its own MD file. Nothing lives only in chat — if a decision or a piece of context matters, it has a file here.

## Folder map

```
personal-brand-os/
├── README.md                  ← you are here
├── docs/
│   ├── 00-request-log.md      ← original request + running decisions log
│   ├── 01-architecture.md     ← full system design + diagram
│   ├── 02-ideas-from-hype-social.md ← review of Prateek's repo + what we took
│   ├── 03-inputs-checklist.md ← everything still needed from Arina
│   └── 04-interview-q1-26.md  ← distilled interview findings (first 26 of 100)
├── brand/
│   ├── character.md           ← who Arina is (template, fill after interview)
│   ├── tone-of-voice.md       ← how Arina sounds (template, fill after interview)
│   ├── messaging.md           ← what Arina says — pillars, POV, bets, lanes
│   └── people.md              ← who to engage fast / watch / avoid
├── channels/
│   ├── linkedin.md            ← LinkedIn stats, formats, cadence
│   └── x.md                   ← X stats, formats, cadence
├── pipeline/
│   ├── 01-signals.md          ← signal discovery engine
│   ├── 02-contacts.md         ← contact creation & outreach tracking
│   ├── 03-content.md          ← content engine (text, photos, carousels)
│   └── 04-analytics.md        ← analytics & learning loop
├── design/
│   └── 01-visual-direction.md ← palette, typography, screen styles (lazygirl ref)
├── integrations/
│   ├── apis.md                ← API inventory + secrets conventions
│   └── skills.md              ← skills plan (marketing-skills repo + Arina's own)
├── data/
│   └── schema.md              ← database schema draft (Supabase-ready)
└── web/                       ← Next.js web app — Today / Review / Stats on mock data
                                 (run: cd web && npm run dev)
```

## What's blocked on Arina

1. **Interview Q27–100** (Q1–26 done → brand files at v0.5) + **5–10 real posts verbatim** for the voice calibration set
2. **API keys** → fills `integrations/apis.md` (keys go in env vars / Supabase secrets, never in these files)
3. **Skills** → her Claude Code skills get referenced in `pipeline/03-content.md`
4. **Current LinkedIn / X stats** → baseline numbers in `channels/*.md`
