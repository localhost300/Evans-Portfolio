create table if not exists public.website_content (
  id text primary key default 'main' check (id = 'main'),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.enquiries (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text,
  location text not null,
  subject text not null,
  message text not null,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

alter table public.website_content enable row level security;
alter table public.enquiries enable row level security;

-- Make this setup script safe to run again after schema updates.
drop policy if exists "Public can read website content" on public.website_content;
drop policy if exists "Authenticated admins can create content" on public.website_content;
drop policy if exists "Authenticated admins can update content" on public.website_content;
drop policy if exists "Anyone can submit an enquiry" on public.enquiries;
drop policy if exists "Authenticated admins can read enquiries" on public.enquiries;
drop policy if exists "Authenticated admins can update enquiries" on public.enquiries;
drop policy if exists "Authenticated admins can delete enquiries" on public.enquiries;

create policy "Public can read website content" on public.website_content for select using (true);
create policy "Authenticated admins can create content" on public.website_content for insert to authenticated with check (true);
create policy "Authenticated admins can update content" on public.website_content for update to authenticated using (true) with check (true);
create policy "Anyone can submit an enquiry" on public.enquiries for insert with check (true);
create policy "Authenticated admins can read enquiries" on public.enquiries for select to authenticated using (true);
create policy "Authenticated admins can update enquiries" on public.enquiries for update to authenticated using (true) with check (true);
create policy "Authenticated admins can delete enquiries" on public.enquiries for delete to authenticated using (true);

-- The CMS inbox uses these three states.
alter table public.enquiries drop constraint if exists enquiries_status_check;
alter table public.enquiries
  add constraint enquiries_status_check check (status in ('New', 'Read', 'Replied'));

create index if not exists enquiries_created_at_idx
  on public.enquiries (created_at desc);

create index if not exists enquiries_status_idx
  on public.enquiries (status);

insert into public.website_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;
