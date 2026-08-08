# Analytics Engine — Close the Loop

Analytics is not a report — it's the feedback loop that makes every other engine smarter.

## The marketing funnel (Stats page)

The personal-brand funnel is built directly from platform metrics — every stage is a real number pulled from X + LinkedIn, and each shows the conversion rate from the stage above it:

1. **Reach** — total impressions (X + LinkedIn)
2. **Engaged** — all reactions + comments + reposts
3. **Profile visits** — profile views + visits
4. **New followers** — follower growth this period
5. **Conversations** — DMs and replies that became threads (ties into the contact engine)
6. **Opportunities** — calls, collabs, inbound interest (replied + booked)

This replaces the old standalone "contact funnel" — outreach now lives as the bottom two stages of one continuous awareness→outcome funnel.

## Full platform metrics surfaced (Stats page)

- **LinkedIn**: impressions, unique views, engagement rate, reactions, comments, reposts, post clicks, profile views, search appearances, SSI
- **X**: impressions, engagement rate, likes, replies, reposts, quotes, bookmarks, profile visits, link clicks, mentions
- Both show follower count + period delta. Source: TwitterAPI.io (X) and LinkedIn analytics export/manual until an API path is chosen.

## What gets measured

### Content performance
- per post: impressions, engagement (likes/comments/reposts/saves), profile visits, follows attributed
- rolled up by: pillar, format (text/photo/carousel), hook style, channel, time-of-day

### Contact performance
- accept rate, reply rate, conversation→outcome rate
- by opener style, source signal type, audience segment

### Account growth
- weekly snapshots: followers, avg impressions, engagement rate per channel (the baseline tables in `channels/*.md`)

### System health
- signals ingested vs surfaced vs acted on (is the filter too tight/loose?)
- drafts approved vs edited vs skipped (is the voice on target? — edit rate is the key quality metric)

## Data collection

| Channel | Method |
|---|---|
| X | TwitterAPI.io polling own posts (24h, 72h, 7d after publish) |
| LinkedIn | v1: manual entry in iOS app (30-sec weekly ritual) or analytics export upload; later: 3rd-party API |
| Contacts | status changes in the app are themselves the data |

## The learning loop

```
weekly job: analyze last 30 days
  → which pillars/formats/hooks over/under-perform
  → check status of the bets in brand/messaging.md → "What I'm testing"
  → write a weekly digest (MD + push notification): "what worked, what to do more of"
  → attach SUGGESTIONS (see below)
```

Every weekly digest is saved as `analytics/digests/YYYY-WW.md` — the MD-file-per-work-unit rule applies here too.

## Suggestions — the system proposes, Arina approves

The system **never edits the brand files itself**. Instead the weekly digest ends with a short list of concrete proposed changes, each approvable with one tap in the iOS app:

> - Add "circle back" to banned phrases (you removed it from 4 drafts this month)
> - Bet #2 has enough data — mark as proven?
> - You replied to @someone 3× this month — add to Priority people list?

Approve → the file gets updated (with a one-line note in its changelog). Skip → it's dropped. That's the whole loop — no audit tables, no cooldowns, no meta-skills.

## Quick notes (input to suggestions)

One text field in the iOS app: when Arina notices something ("threads feel dead lately", "people loved the cost-breakdown post"), she drops a one-liner. Notes are raw material for next week's suggestions — nothing else happens automatically.

## Flags — the 3 hygiene checks worth having

Checked daily; each becomes a push notification at most once:

1. A scheduled draft contains a banned phrase from `brand/tone-of-voice.md`
2. Nothing is scheduled for tomorrow on either channel
3. A signal source has been failing for 2+ days (so weeks of silence don't go unnoticed)

## iOS Stats screen (v1)

- This week vs last week: followers, impressions, engagement per channel
- Top 3 / bottom 3 posts with one-line "why" from the weekly analysis
- Contact funnel: queued → sent → replied
- Pillar balance chart (target mix vs actual)
