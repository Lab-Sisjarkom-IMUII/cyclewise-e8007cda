-- Create AI insights table
create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  predicted_next_cycle_start date,
  predicted_ovulation_date date,
  cycle_length_avg integer,
  insights_text text,
  created_at timestamp with time zone default now()
);

alter table public.ai_insights enable row level security;

create policy "insights_select_own"
  on public.ai_insights for select
  using (auth.uid() = user_id);

create policy "insights_insert_own"
  on public.ai_insights for insert
  with check (auth.uid() = user_id);

create policy "insights_update_own"
  on public.ai_insights for update
  using (auth.uid() = user_id);
