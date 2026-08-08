# LLM Layer — Provider-Agnostic Adapter

Decided 2026-06-19 (Arina considered Hermes/Nous; chose a swappable adapter over locking to one model). Every agent role calls `callLLM(...)` and the adapter routes to **Claude** or **Nous** per role, overridable by env. Built with the official Anthropic SDK; the Nous provider is a separate OpenAI-compatible client (the two never mix).

## Why an adapter (not a platform)

"Multiple agents" here = multiple prompt roles the Next.js backend sequences — not a multi-agent framework. The roles: `scorer`, `drafter`, `voice_check`, `contact`, `digest`. Each is one LLM call. The adapter lets each role run on the best/cheapest model without rewrites. (Hermes Agent the desktop app is not embeddable in a deployed web app; the relevant Nous surface is Nous Portal's API.)

## Files (`web/lib/llm/`)

| File | Role |
|---|---|
| `types.ts` | `Provider`, `AgentRole`, `LLMRequest`, `LLMResult` |
| `config.ts` | per-role provider + model + thinking, env-overridable |
| `claude.ts` | Anthropic SDK provider — `claude-opus-4-8`, adaptive thinking on generative roles, structured output via `output_config.format`. Accepts ANTHROPIC_API_KEY or CLAUDE_API_KEY |
| `gemini.ts` | Google Generative Language provider — default `gemini-2.0-flash`, GEMINI_API_KEY |
| `nous.ts` | Nous Portal provider — OpenAI-compatible `chat/completions`, base URL + model env-configurable |

Research: `lib/research.ts` (Perplexity, `sonar`) runs a live web-grounded query in `/api/advisor` and feeds the findings into the analysis. Best-effort — never blocks. Needs PERPLEXITY_API_KEY.
| `index.ts` | `callLLM()` router + availability helpers; falls back to whichever provider has a key |

Consumer so far: `lib/agents/draft-angle.ts` (drafter role) → `app/api/draft-angle/route.ts`, wired to the "Draft angle" button on each real signal card.

## Default routing

| Role | Provider | Model | Thinking |
|---|---|---|---|
| scorer | nous | Hermes-4-405B | off |
| drafter | claude | claude-opus-4-8 | adaptive |
| voice_check | claude | claude-opus-4-8 | adaptive |
| contact | claude | claude-opus-4-8 | adaptive |
| digest | claude | claude-opus-4-8 | adaptive |

Voice-sensitive roles default to Claude (quality); bulk scoring defaults to Nous (cost). Override per role:
```
LLM_PROVIDER_DRAFTER=nous     LLM_MODEL_DRAFTER=Hermes-4-405B
LLM_PROVIDER_SCORER=claude    LLM_MODEL_SCORER=claude-haiku-4-5
```

## Env keys

- `ANTHROPIC_API_KEY` — Claude. (A key is present in the shell env but **out of credits** as of 2026-06-19 — add credits or a funded key in `web/.env.local`.)
- `NOUS_PORTAL_API_KEY` (+ optional `NOUS_PORTAL_BASE_URL`, default `https://inference-api.nousresearch.com/v1`) — ⚠️ verify the exact base URL + model slug against the Nous Portal account.

## Verify wiring (no tokens)

`GET /api/llm-status` → `{ providers: {claude, nous}, roles: {...} }`. Confirmed 2026-06-19: routing resolves correctly, Claude reachable (request shape + auth valid; only billing blocks live output). `POST /api/draft-angle` returns a friendly message when a key is missing/unfunded.

## Next

- Add credits / a funded key → the "Draft angle" button produces real voice-matched angles.
- Upgrade `draft-angle.ts` to read the full `brand/*.md` (+ calibration posts) instead of the inlined voice rules.
- Add the `scorer` consumer (Claude/Nous evaluation as phase 2 after the heuristic) and `voice_check`.
