create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  amount numeric(10,2) not null check (amount > 0),
  category text not null check (category in ('Utility','Fine','Repair')),
  story text not null,
  grit numeric(3,1) not null,
  status text not null default 'active' check (status in ('active','extinguished')),
  extinguished_by text,
  extinguished_at timestamptz,
  created_at timestamptz not null default now()
);

alter table bills enable row level security;
create policy "public read" on bills for select using (true);
create policy "public submit" on bills for insert with check (status = 'active');
-- MVP only: tighten to authenticated patrons once Supabase Auth is wired.
create policy "patrons extinguish" on bills for update using (status = 'active');

create or replace view lords as
  select extinguished_by as handle, sum(amount) as total, count(*) as wipes
  from bills where status = 'extinguished' group by extinguished_by;
