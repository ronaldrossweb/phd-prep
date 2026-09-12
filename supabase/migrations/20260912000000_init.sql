-- PhD Prep — core schema.
-- One row of study state per user, plus append-only review, exercise and quiz logs.
-- Row-level security: a user can only ever see and write their own rows.

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at  timestamptz not null default now()
);

-- Whole-app study state (SM-2 card states, session/block completion, minutes).
-- Kept as one JSON document: it's small, it changes as a unit, and the app
-- already merges it offline-first.
create table if not exists public.study_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Every graded flashcard review. Append-only.
create table if not exists public.reviews (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  card_id    text not null,
  grade      smallint not null check (grade between 0 and 3),
  reviewed_at timestamptz not null,
  unique (user_id, card_id, reviewed_at)
);
create index if not exists reviews_user_time on public.reviews (user_id, reviewed_at desc);

-- Every checked practice exercise attempt (the in-browser Python environment).
create table if not exists public.exercise_attempts (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  module_id   text not null,
  exercise_id text not null,
  passed      boolean not null,
  code        text,
  attempted_at timestamptz not null default now()
);
create index if not exists exercise_user_time on public.exercise_attempts (user_id, attempted_at desc);

-- Every quiz answer.
create table if not exists public.quiz_answers (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  module_id   text not null,
  question_id text not null,
  chosen      text not null,
  correct     boolean not null,
  answered_at timestamptz not null default now()
);
create index if not exists quiz_user_time on public.quiz_answers (user_id, answered_at desc);

-- Module (lesson) completion: which steps of which module are done.
create table if not exists public.module_progress (
  user_id     uuid not null references auth.users(id) on delete cascade,
  module_id   text not null,
  steps_done  text[] not null default '{}',
  completed_at timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, module_id)
);

-- ---------------------------------------------------------------- security
alter table public.profiles          enable row level security;
alter table public.study_state       enable row level security;
alter table public.reviews           enable row level security;
alter table public.exercise_attempts enable row level security;
alter table public.quiz_answers      enable row level security;
alter table public.module_progress   enable row level security;

create policy "own profile"   on public.profiles          for all using (auth.uid() = id)      with check (auth.uid() = id);
create policy "own state"     on public.study_state       for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own reviews"   on public.reviews           for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own exercises" on public.exercise_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own quizzes"   on public.quiz_answers      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own modules"   on public.module_progress   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Create a profile row automatically when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
