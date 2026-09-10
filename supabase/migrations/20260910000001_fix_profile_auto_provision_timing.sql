-- Bug: handle_new_user() (20260907000020) only fired AFTER INSERT on auth.users
-- and hard-failed on missing phone/role. In practice, Supabase Auth's
-- admin.createUser inserts the auth.users row first with empty
-- raw_app_meta_data, then issues a separate UPDATE within the same
-- transaction to set the app_metadata we pass in (role/phone/full_name/...).
-- The AFTER INSERT trigger therefore always saw nulls, the NOT NULL
-- constraints on profiles.phone/role raised, and the whole transaction
-- (including the auth.users insert) rolled back — every self-registration
-- failed with "Couldn't create your account."
--
-- Fix: skip provisioning on the initial insert if metadata isn't there yet,
-- and also run on UPDATE of raw_app_meta_data (when GoTrue actually sets it),
-- upserting so the trigger is safe regardless of which event carries the data.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.raw_app_meta_data ->> 'phone' is null or new.raw_app_meta_data ->> 'role' is null then
    return new;
  end if;

  insert into public.profiles (id, phone, full_name, role, preferred_language, society_id, federation_id)
  values (
    new.id,
    new.raw_app_meta_data ->> 'phone',
    coalesce(new.raw_app_meta_data ->> 'full_name', ''),
    (new.raw_app_meta_data ->> 'role')::user_role,
    coalesce(new.raw_app_meta_data ->> 'preferred_language', 'hi'),
    nullif(new.raw_app_meta_data ->> 'society_id', '')::uuid,
    nullif(new.raw_app_meta_data ->> 'federation_id', '')::uuid
  )
  on conflict (id) do update set
    phone               = excluded.phone,
    full_name           = excluded.full_name,
    role                = excluded.role,
    preferred_language  = excluded.preferred_language,
    society_id          = excluded.society_id,
    federation_id       = excluded.federation_id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert or update of raw_app_meta_data on auth.users
  for each row execute function handle_new_user();
