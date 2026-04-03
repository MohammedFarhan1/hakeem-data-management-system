create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'faculty');
  end if;

  if not exists (select 1 from pg_type where typname = 'record_status') then
    create type public.record_status as enum ('draft', 'submitted', 'reviewed');
  end if;
end $$;

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  year text not null unique
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text not null unique,
  role public.user_role not null default 'faculty',
  department_id uuid references public.departments (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category_id uuid not null references public.categories (id) on delete restrict,
  department_id uuid references public.departments (id) on delete set null,
  academic_year_id uuid references public.academic_years (id) on delete set null,
  created_by uuid not null references public.users (id) on delete cascade,
  status public.record_status not null default 'submitted',
  form_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.records (id) on delete cascade,
  file_url text not null,
  file_type text not null,
  file_name text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.users
    where id = user_id and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'faculty')
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.departments enable row level security;
alter table public.academic_years enable row level security;
alter table public.categories enable row level security;
alter table public.users enable row level security;
alter table public.records enable row level security;
alter table public.files enable row level security;

drop policy if exists "reference_select_authenticated" on public.departments;
create policy "reference_select_authenticated" on public.departments
for select to authenticated
using (true);

drop policy if exists "academic_years_select_authenticated" on public.academic_years;
create policy "academic_years_select_authenticated" on public.academic_years
for select to authenticated
using (true);

drop policy if exists "categories_select_authenticated" on public.categories;
create policy "categories_select_authenticated" on public.categories
for select to authenticated
using (true);

drop policy if exists "users_select_self_or_admin" on public.users;
create policy "users_select_self_or_admin" on public.users
for select to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "users_update_self_or_admin" on public.users;
create policy "users_update_self_or_admin" on public.users
for update to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()))
with check (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "records_select_own_or_admin" on public.records;
create policy "records_select_own_or_admin" on public.records
for select to authenticated
using (created_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "records_insert_own_or_admin" on public.records;
create policy "records_insert_own_or_admin" on public.records
for insert to authenticated
with check (created_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "records_update_own_or_admin" on public.records;
create policy "records_update_own_or_admin" on public.records
for update to authenticated
using (created_by = auth.uid() or public.is_admin(auth.uid()))
with check (created_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "records_delete_own_or_admin" on public.records;
create policy "records_delete_own_or_admin" on public.records
for delete to authenticated
using (created_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "files_select_related_record" on public.files;
create policy "files_select_related_record" on public.files
for select to authenticated
using (
  exists (
    select 1
    from public.records
    where records.id = files.record_id
      and (records.created_by = auth.uid() or public.is_admin(auth.uid()))
  )
);

drop policy if exists "files_insert_related_record" on public.files;
create policy "files_insert_related_record" on public.files
for insert to authenticated
with check (
  exists (
    select 1
    from public.records
    where records.id = files.record_id
      and (records.created_by = auth.uid() or public.is_admin(auth.uid()))
  )
);

insert into storage.buckets (id, name, public)
values ('record-files', 'record-files', false)
on conflict (id) do nothing;

drop policy if exists "record_files_select_owner_or_admin" on storage.objects;
create policy "record_files_select_owner_or_admin" on storage.objects
for select to authenticated
using (
  bucket_id = 'record-files'
  and (
    public.is_admin(auth.uid())
    or split_part(name, '/', 1) = auth.uid()::text
  )
);

drop policy if exists "record_files_insert_owner_or_admin" on storage.objects;
create policy "record_files_insert_owner_or_admin" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'record-files'
  and (
    public.is_admin(auth.uid())
    or split_part(name, '/', 1) = auth.uid()::text
  )
);
