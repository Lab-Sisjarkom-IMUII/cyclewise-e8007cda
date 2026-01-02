-- Create menstrual cycles table
create table if not exists public.cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.cycles enable row level security;

create policy "cycles_select_own"
  on public.cycles for select
  using (auth.uid() = user_id);

create policy "cycles_insert_own"
  on public.cycles for insert
  with check (auth.uid() = user_id);

create policy "cycles_update_own"
  on public.cycles for update
  using (auth.uid() = user_id);

create policy "cycles_delete_own"
  on public.cycles for delete
  using (auth.uid() = user_id);
