-- ARCHITECTURE-V2 §2.1: sign-up goes through Supabase Auth (email/password, with
-- a phone-styled email — `${phone}@sahaayak.app`). Account creation always runs
-- as a server action using the service-role client (CLAUDE.md rule #3), which
-- passes `role`/`phone`/`full_name`/etc. as `app_metadata` at creation time so
-- they land in the JWT immediately (v2 §3.2 — middleware and RLS both read
-- app_metadata, never a DB row). This trigger turns that into the matching
-- `profiles` row atomically, so a `profiles` row always exists for every
-- `auth.users` row — including ones created outside our server actions (e.g.
-- directly in the Supabase dashboard while debugging).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, phone, full_name, role, preferred_language, society_id, federation_id)
  values (
    new.id,
    new.raw_app_meta_data ->> 'phone',
    coalesce(new.raw_app_meta_data ->> 'full_name', ''),
    (new.raw_app_meta_data ->> 'role')::user_role,
    coalesce(new.raw_app_meta_data ->> 'preferred_language', 'hi'),
    nullif(new.raw_app_meta_data ->> 'society_id', '')::uuid,
    nullif(new.raw_app_meta_data ->> 'federation_id', '')::uuid
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
