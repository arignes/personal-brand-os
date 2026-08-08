# Skills Plan

Sources of skills: Arina's own (still to be sent), https://github.com/hyperfx-ai/marketing-skills, https://github.com/coreyhaines31/marketingskills, and https://github.com/ComposioHQ/awesome-claude-skills (all reviewed 2026-06-10).

## How the two repos differ (they complement, not compete)

| | hyperfx-ai/marketing-skills | coreyhaines31/marketingskills |
|---|---|---|
| What they are | Instructions for **tools** (publish, generate images) | Pure **knowledge** (frameworks, decision rules) |
| Dependency | Hyper MCP platform (paid) | None — plain markdown, works today |
| Role in our system | The hands — publishing & assets | The brains — quality of strategy & copy |

Corey's repo has one pattern we already match: every skill reads a shared `product-marketing.md` context file before doing anything. Our `brand/*.md` files ARE that context — when installing, point the skills at `brand/` instead.

## Important caveat about marketing-skills

All 20 skills in that repo are instruction files for tools that live on the **Hyper MCP** (app.hyperfx.ai) — a hosted platform with 100+ integrations. The skills are useless without it. So this is really one decision: **connect Hyper MCP, or build direct API calls ourselves.**

- **For Hyper MCP**: it solves the hardest problem in our stack — real LinkedIn publishing (text posts, PDF document posts, and even AI text-to-carousel). Our current plan was "copy button + post manually". It also bundles image generation (OpenAI / Nano Banana / Seedream) behind one endpoint, with per-action approval rules (fits our "nothing auto-sends" principle).
- **Against**: another paid subscription + a third-party in the publishing path. Everything except LinkedIn posting we can do with direct APIs we already planned.

**Recommendation:** trial Hyper MCP for the LinkedIn integration alone. If it works, v1 LinkedIn publishing goes through it; if not, we stay with copy-button.

## From marketing-skills — adopt (4 of 20)

| Skill | Why for us | Plugs into |
|---|---|---|
| `linkedin` | Text posts, document/PDF posts, **text-to-carousel** — the whole LinkedIn publishing problem | `pipeline/03-content.md` publish step |
| `image-generation` | Tool-selection rules for photo posts (when OpenAI vs Nano Banana vs Seedream — e.g. text-in-image needs specific models) | `pipeline/03-content.md` photo drafts |
| `youtube-transcript` | Repurposing: podcast/video she likes (or appears in) → transcript → post drafts in her voice | `pipeline/01-signals.md` as a manual signal source |
| `competitor-intel` | Light version: what are similar personal brands posting that works | weekly digest input |

## From marketing-skills — skip

`google-ads`, `meta-ads`, `meta-ads-library`, `tiktok-ads`, `amazon-ads`, `pinterest-ads` (no paid ads for a personal brand v1), `email-lifecycle`, `cold-email-outreach` (our outreach is social DMs, not email — revisit if a newsletter happens), `tiktok`, `instagram` (channels out of scope v1), `seo-research`, `analytics-insights` (GA4 — no website yet), `video-generation` (no video v1), `customer-research`, `ad-creative-generation`, `hyper-cli`.

## From coreyhaines31/marketingskills — adopt (6 of 44)

| Skill | Why for us | Plugs into |
|---|---|---|
| `social` | The core one: platform-specific post creation, repurposing rules, hooks, carousels, social listening triage | content engine drafting prompts |
| `copy-editing` | Perfect engine for our **voice check gate** — edits drafts against voice rules instead of regenerating | `pipeline/03-content.md` voice check |
| `copywriting` | Hooks, value props, CTAs — sharpens every draft | content engine |
| `content-strategy` | Pillar planning, "searchable vs shareable" framing — useful when we revisit pillar mix | `brand/messaging.md` reviews |
| `marketing-psychology` | Why hooks work (social proof, curiosity gap, loss aversion) — feeds hook generation | content engine |
| `marketing-ideas` | Idea bank for slow signal weeks | manual signal source |

Later, when relevant: `launch` (when Arina ships something), `public-relations` (when brand is bigger), `lead-magnets` + `emails` (if a newsletter happens).

**Skip** (built for SaaS companies, not personal brands): cro, signup, onboarding, paywalls, popups, pricing, churn-prevention, referrals, revops, sales-enablement, all SEO/ads/ASO skills, sms, free-tools, directory-submissions, schema, site-architecture, ab-testing, prospecting, cold-email, competitor-profiling, customer-research, co-marketing, community-marketing, video, image, analytics, ad-creative, ads, competitors, product-marketing (our `brand/` replaces it), aso, programmatic-seo, seo-audit, ai-seo, copy editing duplicates none.

**Install** (when build starts): `npx skills add coreyhaines31/marketingskills --skill social` (etc.) — or copy the 6 SKILL.md files into this repo's `skills/` so there's no external dependency at all.

## From ComposioHQ/awesome-claude-skills — adopt (2 of ~30)

A general-purpose grab-bag (invoices, resumes, GIFs, webapp testing), not a marketing collection. Worth taking:

| Skill | Why for us | Plugs into |
|---|---|---|
| `twitter-algorithm-optimizer` | Scores/rewrites tweet drafts against X's open-sourced ranking algorithm (Real-graph, SimClusters) — a final optimization pass on X drafts. Caveat: based on the 2023 algorithm dump, treat as heuristics not gospel | content engine, X drafts |
| `canvas-design` | Anthropic's visual-design skill — produces designed PDFs/graphics. Candidate for our **carousel renderer** (the one piece we had marked "TBD") | `pipeline/03-content.md` carousel rendering |

Maybe later: `content-research-writer` (research + citations for long-form — overlaps with Corey's `copywriting`, revisit if a newsletter/blog happens). Note: `skill-creator` is already built into Claude Code — useful when Arina authors her own skills, no install needed.

**Skip the rest** — lead-research (ICP/sales-shaped, our contact engine is signal-driven), competitive-ads-extractor, internal-comms, meeting-insights, invoice/file organizers, resume generator, GIF/raffle/domain toys, mcp-builder, webapp-testing, document/theme skills.

## Arina's own skills

> ⚠️ AWAITING — she will send them. Each gets a row here + a role in `pipeline/03-content.md`.

| Skill | Role in pipeline | Status |
|---|---|---|
| | | |
