-- Extensions
create extension if not exists pgcrypto with schema extensions;
create extension if not exists postgis with schema extensions;

-- Shared by every table: bumps updated_at on any row change.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
