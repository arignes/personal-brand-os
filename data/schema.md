# Database Schema — Supabase (Postgres)

Draft schema, written as Supabase-ready SQL. Will become `migrations/*.sql` in Phase 1 (same migration pattern as job-agent: idempotent, run on startup).

## Entity overview

```
signals ──┬──> contacts ──> contact_events
          └──> content_drafts ──> publications ──> post_metrics
account_snapshots          weekly_digests
```

## Tables

```sql
-- Everything the signal engine finds, after dedupe
create table signals (
  id uuid primary key default gen_random_uuid(),
  source text not null,                 -- 'twitterapi' | 'news' | 'scraper' | 'manual'
  url text,
  dedup_key text unique not null,       -- hash(url or content)
  author_handle text,
  author_followers int,
  content text not null,
  raw jsonb,                            -- original payload
  found_at timestamptz not null default now(),
  expires_at timestamptz,               -- found_at + 24h; pending past this drops out of feed

  -- scoring
  heuristic_score int,                  -- 0–100, null = not yet scored
  claude_score numeric(2,1),            -- 0–5
  action text,                          -- 'CONTACT' | 'CONTENT' | 'REPLY' | 'SKIP'
  pillar text,
  angle text,                           -- suggested hook
  score_reason text,
  status text not null default 'NEW'    -- NEW | SCORED | ROUTED | DISMISSED | EXPIRED
);

-- People worth reaching (personal CRM)
create table contacts (
  id uuid primary key default gen_random_uuid(),
  signal_id uuid references signals(id),
  name text,
  handle_x text,
  handle_linkedin text,
  title text,
  company text,
  channel text not null,                -- 'linkedin' | 'x'
  why text,                             -- reason to connect
  pillar text,
  draft_opener text,
  status text not null default 'QUEUED',-- QUEUED|DRAFTED|APPROVED|SENT|REPLIED|RELATIONSHIP|CLOSED
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table contact_events (            -- audit trail of the relationship
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts(id) not null,
  event text not null,                   -- 'sent' | 'replied' | 'call_booked' | note...
  detail text,
  at timestamptz default now()
);

-- Drafts from the content engine
create table content_drafts (
  id uuid primary key default gen_random_uuid(),
  signal_id uuid references signals(id), -- null if Arina's own idea
  channel text not null,                 -- 'linkedin' | 'x'
  format text not null,                  -- 'text' | 'photo' | 'carousel' | 'reply' | 'thread'
  pillar text,
  hook_options jsonb,                    -- up to 3 hooks
  body text,
  assets jsonb,                          -- image prompts / slide copy / file refs
  voice_check jsonb,                     -- {passed: bool, issues: []}
  status text not null default 'DRAFTED',-- DRAFTED|IN_REVIEW|APPROVED|SCHEDULED|PUBLISHED|SKIPPED
  scheduled_for timestamptz,
  created_at timestamptz default now()
);

-- What actually went live
create table publications (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references content_drafts(id) not null,
  channel text not null,
  external_url text,                     -- link to the live post
  external_id text,                      -- platform post id (for metric polling)
  published_at timestamptz not null
);

-- Metrics polled (X) or entered manually (LinkedIn), multiple snapshots per post
create table post_metrics (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid references publications(id) not null,
  captured_at timestamptz default now(),
  impressions int, likes int, comments int, reposts int, saves int,
  profile_visits int, follows int,
  raw jsonb
);

-- Weekly channel-level snapshots (the baseline tables in channels/*.md)
create table account_snapshots (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  captured_at date not null,
  followers int, avg_impressions int, engagement_rate numeric,
  unique (channel, captured_at)
);

-- Output of the weekly learning loop
create table weekly_digests (
  id uuid primary key default gen_random_uuid(),
  week text not null unique,             -- '2026-W24'
  summary_md text not null,
  adjustments jsonb,                     -- keyword weights, mix targets changed
  created_at timestamptz default now()
);

-- The listening universe (mirror of brand/people.md)
create table people (
  id uuid primary key default gen_random_uuid(),
  handle text not null,
  platform text not null,                -- 'x' | 'linkedin'
  list text not null,                    -- 'priority' | 'watch' | 'avoid'
  why text,
  unique (handle, platform)
);

-- Arina's quick observations (raw material for weekly suggestions)
create table notes (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  created_at timestamptz default now()
);

-- Weekly proposed changes to brand files — approve/skip in app
create table suggestions (
  id uuid primary key default gen_random_uuid(),
  digest_week text,                      -- which digest proposed it
  proposal text not null,                -- human-readable, e.g. "add X to banned phrases"
  target_file text,                      -- e.g. 'brand/tone-of-voice.md'
  status text not null default 'PENDING',-- PENDING | APPROVED | SKIPPED
  created_at timestamptz default now()
);

-- Daily hygiene checks → push notifications
create table flags (
  id uuid primary key default gen_random_uuid(),
  kind text not null,                    -- 'banned_phrase' | 'empty_calendar' | 'source_down'
  detail text,
  status text not null default 'OPEN',   -- OPEN | RESOLVED | DISMISSED
  created_at timestamptz default now()
);
```

## Notes

- Single-user system → RLS simple: one authenticated user (Arina) owns everything; service role for workers.
- `signals.raw` / `post_metrics.raw` keep original payloads so we can re-score without re-fetching.
- Brand files (`brand/*.md`) stay as files, versioned in the repo — they're prompts, not data. Workers read them at runtime.
- Until Supabase is provisioned, the same schema runs fine on local SQLite/Postgres for development.
