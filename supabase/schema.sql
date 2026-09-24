-- Alarm & Maintenance schema. Run in Supabase SQL Editor.
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text not null default 'technician' check (role in ('admin','technician','viewer')));
create table machines (
  machine_id text primary key check (length(trim(machine_id))>0),
  name text not null, type text, location text,
  status text not null default 'Stop' check (status in ('Running','Stop','Alarm','Maintenance')),
  created_at timestamptz default now());
create table alarms (
  id bigint generated always as identity primary key,
  machine_id text not null references machines on update cascade on delete cascade,
  alarm_code text not null, description text not null, cause text,
  status text not null default 'Open' check (status in ('Open','In Progress','Closed')),
  occurred_at timestamptz not null default now(),
  updated_by uuid references profiles default auth.uid(), updated_at timestamptz default now());
create table maintenance_records (
  id bigint generated always as identity primary key,
  machine_id text not null references machines on update cascade on delete cascade,
  technician_id uuid references profiles default auth.uid(),
  problem text not null, action_taken text,
  status text not null default 'Open' check (status in ('Open','In Progress','Done')),
  created_at timestamptz default now());

create function app_role() returns text language sql security definer stable set search_path=public
as $$ select role from profiles where id=auth.uid() $$;

create function handle_new_user() returns trigger language plpgsql security definer set search_path=public
as $$ begin insert into profiles(id,full_name) values (new.id,new.raw_user_meta_data->>'full_name'); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

alter table profiles enable row level security;
alter table machines enable row level security;
alter table alarms enable row level security;
alter table maintenance_records enable row level security;

create policy "profiles read" on profiles for select using (id=auth.uid() or app_role()='admin');
create policy "profiles admin write" on profiles for update using (app_role()='admin');
create policy "machines read" on machines for select to authenticated using (true);
create policy "machines admin write" on machines for all using (app_role()='admin') with check (app_role()='admin');
create policy "alarms read" on alarms for select to authenticated using (true);
create policy "alarms write" on alarms for insert with check (app_role() in ('admin','technician'));
create policy "alarms update" on alarms for update using (app_role() in ('admin','technician'));
create policy "alarms admin delete" on alarms for delete using (app_role()='admin');
create policy "mnt read" on maintenance_records for select to authenticated using (true);
create policy "mnt write" on maintenance_records for insert with check (app_role() in ('admin','technician'));
create policy "mnt update" on maintenance_records for update using (app_role() in ('admin','technician'));
create policy "mnt admin delete" on maintenance_records for delete using (app_role()='admin');
-- Make yourself admin after creating your user:
-- update profiles set role='admin' where id=(select id from auth.users where email='you@example.com');
