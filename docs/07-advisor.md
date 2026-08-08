# Advisor — University Partner Project

Added 2026-06-19 as a scope variant: a multi-user brand-advisor flow (not just Arina's own OS). Reuses the existing app's LLM adapter and design system.

## Flow

`/advisor` (one page):
1. **You & your socials** — name + LinkedIn / Instagram / X / other + a free-text "what do you want to post / focus / goals".
2. **Ten questions** — condensed from the 100-question voice interview: identity, audience, goals, pillars, services, tone, what-to-avoid, differentiator, 90-day success, admired creators.
3. **Analyze my brand** → `POST /api/advisor` → `analyzeIntake()`.

Results (same page): refined positioning, tone summary, audience read (summary + segments), 3–4 content pillars, 4–6 focus recommendations, and 3 sample posts in their voice.

## How it works

- `lib/advisor.ts` — `Intake`/`AdvisorResult` types, the 10 `QUESTIONS`, a JSON schema for structured output, `analyzeIntake()` (calls the provider-agnostic LLM adapter with the schema), and `demoResult()`.
- **Graceful fallback:** no key, unfunded key, or unparseable output → a clearly-labeled demo result that echoes the user's inputs, so the flow always demos.
- Provider routing via `lib/llm/` (Claude or Nous, per `docs/06-llm-layer.md`).

## To make it live

Add a funded key to `web/.env.local` (`ANTHROPIC_API_KEY` or `NOUS_PORTAL_API_KEY`). Then the plan + posts are real and personalized; the "Demo mode" banner disappears.

## Possible next steps (if time)

- Enrich the audience read with a real SocialCrawl profile/search lookup on the entered handles.
- Persist submissions to Supabase (multi-user).
- Split into a 2-step wizard; add a "generate more posts" button (reuses `/api/draft-angle`).
