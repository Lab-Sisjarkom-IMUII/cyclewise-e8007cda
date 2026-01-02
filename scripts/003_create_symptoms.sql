-- Create symptoms table
create table if not exists public.symptoms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_id uuid references public.cycles(id) on delete cascade,
  symptom_type text not null,
  description text,
  intensity integer check (intensity >= 1 and intensity <= 5),
  recorded_date date not null,
  created_at timestamp with time zone default now()
);

alter table public.symptoms enable row level security;

create policy "symptoms_select_own"
  on public.symptoms for select
  using (auth.uid() = user_id);

create policy "symptoms_insert_own"
  on public.symptoms for insert
  with check (auth.uid() = user_id);

create policy "symptoms_update_own"
  on public.symptoms for update
  using (auth.uid() = user_id);

create policy "symptoms_delete_own"
  on public.symptoms for delete
  using (auth.uid() = user_id);
