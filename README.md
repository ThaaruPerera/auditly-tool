# auditly-tool

AI-powered website audit tool that analyzes a webpage and generates structured insights and actionable recommendations using React.

## Supabase setup

Create a `.env.local` file in the project root with:

```bash
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

Run this SQL in your Supabase SQL editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  metrics jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.analysis_history enable row level security;

create policy "Users can read their own analysis history"
on public.analysis_history
for select
using (auth.uid() = user_id);

create policy "Users can insert their own analysis history"
on public.analysis_history
for insert
with check (auth.uid() = user_id);

create table if not exists public.public_report_shares (
  id uuid primary key default gen_random_uuid(),
  share_id text not null unique,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  owner_name text not null default 'Auditly User',
  url text not null,
  metrics jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.public_report_shares
add column if not exists owner_name text not null default 'Auditly User';

alter table public.public_report_shares enable row level security;

create policy "Owners can insert public report shares"
on public.public_report_shares
for insert
to authenticated
with check (auth.uid() = owner_user_id);

create policy "Anyone can read public report shares"
on public.public_report_shares
for select
to anon, authenticated
using (true);
```

In Supabase Auth, enable Email/Password sign-in. If email confirmation is enabled, new users may need to verify their email before logging in.

For Google login, also enable the Google provider in Supabase Auth and add your app URL to the allowed redirect URLs.
