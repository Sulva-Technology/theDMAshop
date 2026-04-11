create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'footer',
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe to newsletter" on public.newsletter_subscribers;
create policy "Anyone can subscribe to newsletter"
on public.newsletter_subscribers for insert
with check (true);

drop policy if exists "Admins manage newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins manage newsletter subscribers"
on public.newsletter_subscribers for all
using (public.is_admin())
with check (public.is_admin());
