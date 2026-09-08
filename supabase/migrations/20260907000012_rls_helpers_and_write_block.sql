-- ARCHITECTURE-V2 §6.1 — read role/scope straight out of the JWT so policies never
-- have to query profiles (which would itself be RLS-gated, risking recursion).
create or replace function auth_role() returns text
language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'ANON');
$$;

create or replace function auth_society_id() returns uuid
language sql stable as $$
  select nullif(auth.jwt() -> 'app_metadata' ->> 'society_id', '')::uuid;
$$;

-- Not shown in the ARCHITECTURE-V2 §6.2 snippet, but referenced by its own
-- `bookings_select_own` example policy (`auth_federation_id()`) — added here
-- following the exact same pattern as the two functions above.
create or replace function auth_federation_id() returns uuid
language sql stable as $$
  select nullif(auth.jwt() -> 'app_metadata' ->> 'federation_id', '')::uuid;
$$;

-- `workers` and `bookings` policies each need to look up the other (a customer's
-- visible workers come from their bookings; a worker's visible bookings come
-- from their worker row), and `societies` and `workers` do the same (a worker's
-- own society; a federation admin's workers by society). Doing that lookup as a
-- plain subquery re-triggers the target table's RLS, which loops back and trips
-- Postgres's "infinite recursion detected in policy" guard. SECURITY DEFINER
-- functions owned by the migration role (which owns every table here) bypass
-- RLS for their internal query, breaking the cycle — the WHERE clause still
-- scopes strictly to auth.uid(), so nothing extra is exposed.
create or replace function my_worker_row_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from workers where user_id = auth.uid();
$$;

create or replace function my_society_id() returns uuid
language sql stable security definer set search_path = public as $$
  select society_id from workers where user_id = auth.uid();
$$;

-- Default-deny on every table (CLAUDE.md rule #4), and every mutation goes through
-- a server action using the service-role key, which bypasses RLS entirely
-- (CLAUDE.md rule #3: "No client-side writes... browser gets anon key and read
-- access only"). So every table gets RLS enabled and an explicit, auditable
-- "nobody writes from the browser" policy — the same shape as ARCHITECTURE-V2
-- §6.2's `bookings_no_client_write` example, applied uniformly instead of only
-- to bookings. SELECT policies (added in later migrations) are the only way any
-- row becomes visible to the browser.
do $$
declare
  t text;
begin
  foreach t in array array[
    'federations','societies','profiles',
    'service_categories','skills','services','society_service_rates',
    'workers','worker_documents','worker_skills','worker_availability',
    'addresses','bookings','booking_offers','booking_status_history',
    'payments','payment_splits','invoices',
    'ratings','welfare_contributions','insurance_policies',
    'daily_demand_stats','demand_forecasts'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy %I on %I for all to authenticated using (false) with check (false)',
      t || '_no_client_write', t
    );
  end loop;
end $$;
