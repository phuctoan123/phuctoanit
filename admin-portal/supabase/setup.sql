-- ════════════════════════════════════════════════════════════
-- ADMIN PORTAL — SUPABASE SETUP SCRIPT
-- Chạy toàn bộ file này trong Supabase SQL Editor
-- phuctoanit.id.vn | Phiên bản: 1.0
-- ════════════════════════════════════════════════════════════

-- EXTENSIONS
create extension if not exists "pgcrypto";

-- ════════════════════════════════════════════════════════════
-- ENUM TYPES
-- ════════════════════════════════════════════════════════════
do $$ begin
  create type lead_status as enum (
    'new',
    'contacted',
    'poc_in_progress',
    'proposal_sent',
    'closed_won',
    'archived'
  );
exception when duplicate_object then null;
end $$;

-- ════════════════════════════════════════════════════════════
-- 1. LEADS (Mini-CRM)
-- ════════════════════════════════════════════════════════════
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  services        text[] not null default '{}',
  other_industry  text,
  name            text not null,
  company         text,
  phone           text not null,
  email           text not null,
  message         text not null,
  status          lead_status not null default 'new',
  internal_notes  text,
  poc_url         text,
  source          text default 'website',
  notified_at     timestamptz
);

create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_services on public.leads using gin (services);

-- ════════════════════════════════════════════════════════════
-- 2. LEAD ACTIVITIES (Timeline / Ghi chú)
-- ════════════════════════════════════════════════════════════
create table if not exists public.lead_activities (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  created_at  timestamptz not null default now(),
  type        text not null check (type in ('created','status_changed','note_added','follow_up_created','follow_up_completed','info_updated')),
  content     text not null,
  metadata    jsonb
);

create index if not exists idx_lead_activities_lead_id on public.lead_activities (lead_id, created_at desc);

-- ════════════════════════════════════════════════════════════
-- 3. FOLLOW UPS
-- ════════════════════════════════════════════════════════════
create table if not exists public.follow_ups (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  lead_id       uuid not null references public.leads(id) on delete cascade,
  scheduled_at  timestamptz not null,
  content       text not null,
  status        text not null default 'pending' check (status in ('pending','done','cancelled')),
  completed_at  timestamptz
);

create index if not exists idx_follow_ups_lead_id on public.follow_ups (lead_id);
create index if not exists idx_follow_ups_scheduled_at on public.follow_ups (scheduled_at);
create index if not exists idx_follow_ups_status on public.follow_ups (status);

-- ════════════════════════════════════════════════════════════
-- 4. SITE SETTINGS (singleton)
-- ════════════════════════════════════════════════════════════
create table if not exists public.site_settings (
  id              smallint primary key default 1 check (id = 1),
  hotline         text,
  email           text,
  address_vi      text,
  address_en      text,
  partner_website text,
  social_links    jsonb not null default '{}'::jsonb,
  seo             jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════
-- 5. SITE ABOUT / HERO (singleton)
-- ════════════════════════════════════════════════════════════
create table if not exists public.site_about (
  id                  smallint primary key default 1 check (id = 1),
  hero_title_vi       text,
  hero_title_en       text,
  hero_tagline_vi     text,
  hero_tagline_en     text,
  about_desc_vi       text,
  about_desc_en       text,
  work_philosophy_vi  text,
  work_philosophy_en  text,
  strengths           jsonb not null default '[]'::jsonb,
  avatar_url          text,
  updated_at          timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════
-- 6. SKILLS
-- ════════════════════════════════════════════════════════════
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  icon        text,
  title_vi    text not null,
  title_en    text not null,
  desc_vi     text,
  desc_en     text,
  sort_order  int not null default 0,
  is_active   boolean not null default true
);

-- ════════════════════════════════════════════════════════════
-- 7. SERVICES + FEATURES
-- ════════════════════════════════════════════════════════════
create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  order_num     int not null,
  icon          text,
  title_vi      text not null,
  title_en      text not null,
  short_desc_vi text,
  short_desc_en text,
  sort_order    int not null default 0,
  is_active     boolean not null default true
);

create table if not exists public.service_features (
  id          uuid primary key default gen_random_uuid(),
  service_id  uuid not null references public.services(id) on delete cascade,
  text_vi     text not null,
  text_en     text not null,
  sort_order  int not null default 0
);

create index if not exists idx_service_features_service_id on public.service_features (service_id);

-- ════════════════════════════════════════════════════════════
-- 8. CASE STUDIES
-- ════════════════════════════════════════════════════════════
create table if not exists public.case_studies (
  id            uuid primary key default gen_random_uuid(),
  title_vi      text,
  title_en      text,
  industry_vi   text not null,
  industry_en   text not null,
  image_url     text,
  problem_vi    text,
  problem_en    text,
  solution_vi   text,
  solution_en   text,
  result_vi     text,
  result_en     text,
  demo_url      text,
  sort_order    int not null default 0,
  is_active     boolean not null default true
);

-- ════════════════════════════════════════════════════════════
-- 9. TESTIMONIALS
-- ════════════════════════════════════════════════════════════
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role_vi     text,
  role_en     text,
  quote_vi    text not null,
  quote_en    text not null,
  sort_order  int not null default 0,
  is_active   boolean not null default true
);

-- ════════════════════════════════════════════════════════════
-- 10. PRICING PLANS + BENEFITS
-- ════════════════════════════════════════════════════════════
create table if not exists public.pricing_plans (
  id             uuid primary key default gen_random_uuid(),
  badge_vi       text,
  badge_en       text,
  title_vi       text not null,
  title_en       text not null,
  tagline_vi     text,
  tagline_en     text,
  audience_vi    text,
  audience_en    text,
  cta_text_vi    text,
  cta_text_en    text,
  is_featured    boolean not null default false,
  sort_order     int not null default 0,
  is_active      boolean not null default true
);

create table if not exists public.pricing_plan_benefits (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid not null references public.pricing_plans(id) on delete cascade,
  text_vi     text not null,
  text_en     text not null,
  sort_order  int not null default 0
);

create index if not exists idx_pricing_benefits_plan_id on public.pricing_plan_benefits (plan_id);

-- ════════════════════════════════════════════════════════════
-- TRIGGER: tự cập nhật updated_at
-- ════════════════════════════════════════════════════════════
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated_at on public.site_settings;
create trigger trg_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_about_updated_at on public.site_about;
create trigger trg_about_updated_at before update on public.site_about
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- TRIGGER: tự tạo activity khi Lead được INSERT
-- ════════════════════════════════════════════════════════════
create or replace function public.on_lead_created()
returns trigger language plpgsql security definer as $$
begin
  insert into public.lead_activities (lead_id, type, content)
  values (new.id, 'created', 'Lead được tạo từ ' || coalesce(new.source, 'website'));
  return new;
end;
$$;

drop trigger if exists trg_lead_created on public.leads;
create trigger trg_lead_created after insert on public.leads
  for each row execute function public.on_lead_created();

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.follow_ups enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_about enable row level security;
alter table public.skills enable row level security;
alter table public.services enable row level security;
alter table public.service_features enable row level security;
alter table public.case_studies enable row level security;
alter table public.testimonials enable row level security;
alter table public.pricing_plans enable row level security;
alter table public.pricing_plan_benefits enable row level security;

-- Helper: check admin
-- QUAN TRỌNG: Thay 'ADMIN_UID_HERE' bằng UID thật sau khi tạo tài khoản trong Supabase Auth
-- Cách tìm UID: Dashboard → Authentication → Users → copy UUID của tài khoản admin
create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select auth.uid()::text = current_setting('app.admin_uid', true);
$$;

-- Cách thay thế đơn giản hơn — dùng metadata check:
-- (Admin user cần có role 'admin' trong user_metadata)
create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select (auth.jwt() ->> 'role') = 'authenticated'
    and (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin';
$$;

-- ── LEADS ──────────────────────────────────────────────────
-- Anon có thể INSERT (form công khai)
drop policy if exists "public can insert leads" on public.leads;
create policy "public can insert leads"
  on public.leads for insert to anon
  with check (true);

-- Authenticated (admin) đọc/sửa/xoá
drop policy if exists "admin can read leads" on public.leads;
create policy "admin can read leads"
  on public.leads for select to authenticated
  using (true);

drop policy if exists "admin can update leads" on public.leads;
create policy "admin can update leads"
  on public.leads for update to authenticated
  using (true) with check (true);

drop policy if exists "admin can delete leads" on public.leads;
create policy "admin can delete leads"
  on public.leads for delete to authenticated
  using (true);

-- ── LEAD ACTIVITIES ────────────────────────────────────────
drop policy if exists "admin can read activities" on public.lead_activities;
create policy "admin can read activities"
  on public.lead_activities for select to authenticated using (true);

drop policy if exists "admin can insert activities" on public.lead_activities;
create policy "admin can insert activities"
  on public.lead_activities for insert to authenticated with check (true);

-- Service definer function cũng cần insert từ trigger (anon insert lead → trigger chạy với security definer)
drop policy if exists "service can insert activities" on public.lead_activities;
create policy "service can insert activities"
  on public.lead_activities for insert to anon with check (false);

-- ── FOLLOW UPS ────────────────────────────────────────────
drop policy if exists "admin can manage follow_ups" on public.follow_ups;
create policy "admin can manage follow_ups"
  on public.follow_ups for all to authenticated
  using (true) with check (true);

-- ── CONTENT TABLES ─────────────────────────────────────────
-- Public đọc content đang active
drop policy if exists "public can read active skills" on public.skills;
create policy "public can read active skills"
  on public.skills for select to anon using (is_active = true);

drop policy if exists "admin full access skills" on public.skills;
create policy "admin full access skills"
  on public.skills for all to authenticated using (true) with check (true);

drop policy if exists "public can read active services" on public.services;
create policy "public can read active services"
  on public.services for select to anon using (is_active = true);

drop policy if exists "admin full access services" on public.services;
create policy "admin full access services"
  on public.services for all to authenticated using (true) with check (true);

drop policy if exists "public can read service_features" on public.service_features;
create policy "public can read service_features"
  on public.service_features for select to anon using (true);

drop policy if exists "admin full access service_features" on public.service_features;
create policy "admin full access service_features"
  on public.service_features for all to authenticated using (true) with check (true);

drop policy if exists "public can read active case_studies" on public.case_studies;
create policy "public can read active case_studies"
  on public.case_studies for select to anon using (is_active = true);

drop policy if exists "admin full access case_studies" on public.case_studies;
create policy "admin full access case_studies"
  on public.case_studies for all to authenticated using (true) with check (true);

drop policy if exists "public can read active testimonials" on public.testimonials;
create policy "public can read active testimonials"
  on public.testimonials for select to anon using (is_active = true);

drop policy if exists "admin full access testimonials" on public.testimonials;
create policy "admin full access testimonials"
  on public.testimonials for all to authenticated using (true) with check (true);

drop policy if exists "public can read active pricing_plans" on public.pricing_plans;
create policy "public can read active pricing_plans"
  on public.pricing_plans for select to anon using (is_active = true);

drop policy if exists "admin full access pricing_plans" on public.pricing_plans;
create policy "admin full access pricing_plans"
  on public.pricing_plans for all to authenticated using (true) with check (true);

drop policy if exists "public can read pricing_plan_benefits" on public.pricing_plan_benefits;
create policy "public can read pricing_plan_benefits"
  on public.pricing_plan_benefits for select to anon using (true);

drop policy if exists "admin full access pricing_plan_benefits" on public.pricing_plan_benefits;
create policy "admin full access pricing_plan_benefits"
  on public.pricing_plan_benefits for all to authenticated using (true) with check (true);

drop policy if exists "public can read site_settings" on public.site_settings;
create policy "public can read site_settings"
  on public.site_settings for select to anon using (true);

drop policy if exists "admin full access site_settings" on public.site_settings;
create policy "admin full access site_settings"
  on public.site_settings for all to authenticated using (true) with check (true);

drop policy if exists "public can read site_about" on public.site_about;
create policy "public can read site_about"
  on public.site_about for select to anon using (true);

drop policy if exists "admin full access site_about" on public.site_about;
create policy "admin full access site_about"
  on public.site_about for all to authenticated using (true) with check (true);

-- ════════════════════════════════════════════════════════════
-- STORAGE BUCKET
-- ════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public can read media" on storage.objects;
create policy "public can read media"
  on storage.objects for select to public using (bucket_id = 'media');

drop policy if exists "admin can upload media" on storage.objects;
create policy "admin can upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

drop policy if exists "admin can update media" on storage.objects;
create policy "admin can update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media');

drop policy if exists "admin can delete media" on storage.objects;
create policy "admin can delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');

-- ════════════════════════════════════════════════════════════
-- SEED: Site Settings mặc định
-- ════════════════════════════════════════════════════════════
insert into public.site_settings (id, hotline, email, address_vi, address_en, partner_website, social_links, seo)
values (1,
  '0913.365.842',
  'phuctoan4906@gmail.com',
  'Ho Chi Minh City, Vietnam',
  'Ho Chi Minh City, Vietnam',
  'nasani.vn',
  '{"zalo": "", "facebook": "", "instagram": "", "linkedin": "", "tiktok": "", "whatsapp": ""}'::jsonb,
  '{"meta_title_vi": "Phúc Toàn IT — Technical Sales Engineer", "meta_title_en": "Phuc Toan IT — Technical Sales Engineer", "meta_desc_vi": "", "meta_desc_en": "", "og_image_url": ""}'::jsonb
)
on conflict (id) do nothing;
