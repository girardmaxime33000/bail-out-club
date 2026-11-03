create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  amount numeric(10,2) not null check (amount > 0),
  category text not null check (category in ('Utility','Fine','Repair')),
  story text not null,
  grit numeric(3,1) not null,
  status text not null default 'active' check (status in ('active','extinguished')),
  extinguished_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists pledges (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references bills(id) on delete cascade,
  handle text not null,
  amount numeric(10,2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

alter table bills enable row level security;
alter table pledges enable row level security;
create policy "public read bills" on bills for select using (true);
create policy "public submit" on bills for insert with check (status = 'active');
create policy "public read pledges" on pledges for select using (true);
-- MVP only: restrict to authenticated patrons once Supabase Auth is wired.
create policy "patrons pledge" on pledges for insert with check (true);
create policy "patrons close" on bills for update using (status = 'active');

create or replace view lords as
  select handle, sum(amount) as total, count(*) as wipes from pledges group by handle;
