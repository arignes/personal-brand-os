-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Stores each Advisor submission + its generated result.

create table if not exists advisor_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  socials jsonb,
  focus text,
  questionnaire jsonb,
  result jsonb,
  demo boolean default false,
  created_at timestamptz default now()
);

-- The app writes with the secret key (server-side), which bypasses RLS.
-- Keeping RLS enabled with no public policy means the table is private:
-- only the server (secret key) can read/write it.
alter table advisor_submissions enable row level security;

-- ACCOUNTS: run this one line to enable per-person saved brands (email identity).
-- Until you run it, the app falls back to showing the latest brand (no accounts).
alter table advisor_submissions add column if not exists email text;
