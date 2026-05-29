-- =============================================
-- STREAM/OS  —  Supabase Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- -----------------------------------------------
-- PLAYLISTS
-- -----------------------------------------------
create table public.playlists (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null check (type in ('xtream', 'm3u')),
  url         text not null,
  provider    text,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- -----------------------------------------------
-- USERS  (subscribers — separate from auth.users)
-- -----------------------------------------------
create table public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  username    text unique not null,
  email       text unique,
  status      text not null default 'active' check (status in ('active','disabled','expired')),
  notes       text,
  created_at  timestamptz default now()
);

-- -----------------------------------------------
-- ACTIVATION CODES
-- -----------------------------------------------
create table public.activation_codes (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  playlist_id   uuid references public.playlists(id) on delete set null,
  subscriber_id uuid references public.subscribers(id) on delete set null,
  max_devices   int not null default 2,
  expires_at    timestamptz,
  is_used       boolean default false,
  created_at    timestamptz default now()
);

-- -----------------------------------------------
-- DEVICES
-- -----------------------------------------------
create table public.devices (
  id              uuid primary key default gen_random_uuid(),
  android_id      text not null,
  tv_name         text,
  subscriber_id   uuid references public.subscribers(id) on delete cascade,
  activation_code text references public.activation_codes(code) on delete set null,
  last_active     timestamptz default now(),
  created_at      timestamptz default now(),
  unique(android_id, subscriber_id)
);

-- -----------------------------------------------
-- ANNOUNCEMENTS
-- -----------------------------------------------
create table public.announcements (
  id          uuid primary key default gen_random_uuid(),
  message     text not null,
  type        text not null default 'info' check (type in ('info','warning','success')),
  target      text not null default 'all',
  sent_at     timestamptz default now(),
  reach       int default 0
);

-- -----------------------------------------------
-- VIEWS
-- -----------------------------------------------

-- Codes with subscriber + playlist info joined
create or replace view public.codes_view as
select
  ac.id,
  ac.code,
  ac.max_devices,
  ac.expires_at,
  ac.is_used,
  ac.created_at,
  p.name  as playlist_name,
  p.type  as playlist_type,
  s.username,
  s.email,
  s.status as subscriber_status,
  (select count(*) from public.devices d where d.activation_code = ac.code) as device_count
from public.activation_codes ac
left join public.playlists p on p.id = ac.playlist_id
left join public.subscribers s on s.id = ac.subscriber_id;

-- -----------------------------------------------
-- ROW LEVEL SECURITY (enable after testing)
-- -----------------------------------------------
-- alter table public.activation_codes enable row level security;
-- alter table public.subscribers enable row level security;
-- alter table public.devices enable row level security;
-- alter table public.playlists enable row level security;
-- alter table public.announcements enable row level security;

-- Service-role bypass policies (for server-side API routes)
-- create policy "service role bypass" on public.activation_codes using (true) with check (true);
