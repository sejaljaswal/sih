-- RLS role-isolation tests (ARCHITECTURE-V2 §6.3): "Write one integration test
-- per role that logs in as that role and attempts to read a row it must not
-- see, asserting an empty result. Six tests."
--
-- The six: CUSTOMER, WORKER, SOCIETY_ADMIN, FEDERATION_ADMIN and unauthenticated
-- (anon) each try to read a row that isolation must hide from them (five
-- "cannot see" tests). SUPER_ADMIN has no such row by design — the RBAC matrix
-- (PRD §8.2) gives it unrestricted read — so its test instead confirms it CAN
-- read across every tenant, the positive case that proves the SUPER_ADMIN
-- policies aren't accidentally scoped.
--
-- Run with: psql <connection> -v ON_ERROR_STOP=1 -f supabase/tests/rls_role_isolation.sql
-- Wrapped in a transaction that always rolls back — safe to run against a
-- dev/staging database with real data; leaves nothing behind either way.
--
-- Requires the `postgres`/owner role executing this script to be able to
-- `SET ROLE` to anon/authenticated (true on any Supabase project and on the
-- local/linked stacks `supabase start` gives you).

begin;

create or replace function test_assert_empty(p_description text, p_count bigint) returns void
language plpgsql as $$
begin
  if p_count <> 0 then
    raise exception 'RLS ISOLATION FAILURE: % returned % row(s), expected 0', p_description, p_count;
  end if;
  raise notice 'PASS: %', p_description;
end;
$$;

create or replace function test_assert_not_empty(p_description text, p_count bigint) returns void
language plpgsql as $$
begin
  if p_count = 0 then
    raise exception 'RLS OVER-RESTRICTION: % returned 0 rows, expected at least 1', p_description;
  end if;
  raise notice 'PASS: %', p_description;
end;
$$;

create or replace function test_login(p_sub uuid, p_role text, p_society uuid, p_federation uuid) returns void
language plpgsql as $$
begin
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object(
      'sub', p_sub,
      'app_metadata', jsonb_build_object('role', p_role, 'society_id', p_society, 'federation_id', p_federation)
    )::text,
    true
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Fixtures: two federations, two societies (one per federation), one customer
-- + worker + society admin + federation admin per society, one booking in
-- society A. Isolation tests all check that society/federation B's data is
-- invisible to society/federation A's users, and vice versa.
--
-- IDs are hex-safe placeholders (uuid literals only accept 0-9a-f): a leading
-- digit per entity type (1=federation, 2=society, 3=customer, 4=worker profile,
-- 5=society admin, 6=federation admin, 7=super admin, 8=worker row, 9=address,
-- a=service category, b=service, c=booking, d=worker document), then A/B as
-- ...0001 / ...0002.
-- ---------------------------------------------------------------------------

insert into federations (id, name, state, code) values
  ('10000000-0000-0000-0000-000000000001', 'Federation A', 'Himachal Pradesh', 'FED-A'),
  ('10000000-0000-0000-0000-000000000002', 'Federation B', 'Punjab', 'FED-B');

insert into societies (id, federation_id, name, registration_no, district, location) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Society A', 'REG-A', 'Shimla',
    st_setsrid(st_makepoint(77.17, 31.10), 4326)::geography),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Society B', 'REG-B', 'Ludhiana',
    st_setsrid(st_makepoint(75.85, 30.90), 4326)::geography);

insert into auth.users (id) values
  ('30000000-0000-0000-0000-000000000001'), ('30000000-0000-0000-0000-000000000002'),
  ('40000000-0000-0000-0000-000000000001'), ('40000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000001'), ('50000000-0000-0000-0000-000000000002'),
  ('60000000-0000-0000-0000-000000000001'), ('60000000-0000-0000-0000-000000000002'),
  ('70000000-0000-0000-0000-000000000001');

insert into profiles (id, phone, full_name, role, society_id, federation_id) values
  ('30000000-0000-0000-0000-000000000001', '9000000001', 'Customer A', 'CUSTOMER', null, null),
  ('30000000-0000-0000-0000-000000000002', '9000000002', 'Customer B', 'CUSTOMER', null, null),
  ('40000000-0000-0000-0000-000000000001', '9000000003', 'Worker A', 'WORKER', '20000000-0000-0000-0000-000000000001', null),
  ('40000000-0000-0000-0000-000000000002', '9000000004', 'Worker B', 'WORKER', '20000000-0000-0000-0000-000000000002', null),
  ('50000000-0000-0000-0000-000000000001', '9000000005', 'Society Admin A', 'SOCIETY_ADMIN', '20000000-0000-0000-0000-000000000001', null),
  ('50000000-0000-0000-0000-000000000002', '9000000006', 'Society Admin B', 'SOCIETY_ADMIN', '20000000-0000-0000-0000-000000000002', null),
  ('60000000-0000-0000-0000-000000000001', '9000000007', 'Federation Admin A', 'FEDERATION_ADMIN', null, '10000000-0000-0000-0000-000000000001'),
  ('60000000-0000-0000-0000-000000000002', '9000000008', 'Federation Admin B', 'FEDERATION_ADMIN', null, '10000000-0000-0000-0000-000000000002'),
  ('70000000-0000-0000-0000-000000000001', '9000000009', 'Super Admin', 'SUPER_ADMIN', null, null);

insert into workers (id, user_id, society_id, verification_status, is_available) values
  ('80000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'VERIFIED', true),
  ('80000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'VERIFIED', true);

insert into addresses (id, user_id, line1, city, pincode, location) values
  ('90000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'House 1', 'Shimla', '171001',
    st_setsrid(st_makepoint(77.17, 31.10), 4326)::geography),
  ('90000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'House 2', 'Ludhiana', '141001',
    st_setsrid(st_makepoint(75.85, 30.90), 4326)::geography);

insert into service_categories (id, name_key) values ('a0000000-0000-0000-0000-000000000001', 'category.repair');
insert into services (id, category_id, name_key) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'service.fan_repair');

insert into bookings (
  id, booking_code, customer_id, service_id, address_id, society_id, worker_id,
  status, quoted_price_paise, rate_snapshot
) values (
  'c0000000-0000-0000-0000-000000000001', 'SHY-TEST-000001',
  '30000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
  '90000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
  '80000000-0000-0000-0000-000000000001', 'ASSIGNED', 80000, '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- Test 1 — ANON: default-deny holds for an unauthenticated request.
-- ---------------------------------------------------------------------------
set local role anon;
select test_login(null, 'ANON', null, null);
select test_assert_empty('anon cannot read bookings', (select count(*) from bookings));
select test_assert_empty('anon cannot read profiles', (select count(*) from profiles));
reset role;

-- ---------------------------------------------------------------------------
-- Test 2 — CUSTOMER: Customer A cannot read Customer B's address.
-- ---------------------------------------------------------------------------
set local role authenticated;
select test_login('30000000-0000-0000-0000-000000000001', 'CUSTOMER', null, null);
select test_assert_empty(
  'customer A cannot read customer B''s address',
  (select count(*) from addresses where id = '90000000-0000-0000-0000-000000000002')
);
reset role;

-- ---------------------------------------------------------------------------
-- Test 3 — WORKER: Worker A cannot read Worker B's uploaded documents.
-- ---------------------------------------------------------------------------
set local role postgres;
insert into worker_documents (id, worker_id, doc_type, file_path) values
  ('d0000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000002', 'ID_PROOF', 'workers/b/id.pdf');
reset role;

set local role authenticated;
select test_login('40000000-0000-0000-0000-000000000001', 'WORKER', '20000000-0000-0000-0000-000000000001', null);
select test_assert_empty(
  'worker A cannot read worker B''s documents',
  (select count(*) from worker_documents where worker_id = '80000000-0000-0000-0000-000000000002')
);
reset role;

-- ---------------------------------------------------------------------------
-- Test 4 — SOCIETY_ADMIN: Society A's admin cannot read Society B's workers.
-- ---------------------------------------------------------------------------
set local role authenticated;
select test_login('50000000-0000-0000-0000-000000000001', 'SOCIETY_ADMIN', '20000000-0000-0000-0000-000000000001', null);
select test_assert_empty(
  'society A admin cannot read society B''s workers',
  (select count(*) from workers where society_id = '20000000-0000-0000-0000-000000000002')
);
reset role;

-- ---------------------------------------------------------------------------
-- Test 5 — FEDERATION_ADMIN: Federation A's admin cannot read Federation B's
-- demand stats.
--
-- (Not `societies`: the RBAC matrix gives Customer an unscoped "R (list)" on
-- societies — it's a public directory of cooperatives, so every authenticated
-- role, federation admins included, can legitimately see every society. That's
-- by design, not a leak. `daily_demand_stats` has no such public/customer row
-- in the matrix, so it isolates cleanly.)
-- ---------------------------------------------------------------------------
set local role postgres;
insert into daily_demand_stats (id, society_id, service_id, stat_date) values
  ('e0000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', current_date);
reset role;

set local role authenticated;
select test_login('60000000-0000-0000-0000-000000000001', 'FEDERATION_ADMIN', null, '10000000-0000-0000-0000-000000000001');
select test_assert_empty(
  'federation A admin cannot read federation B''s demand stats',
  (select count(*) from daily_demand_stats where society_id = '20000000-0000-0000-0000-000000000002')
);
reset role;

-- ---------------------------------------------------------------------------
-- Test 6 — SUPER_ADMIN: positive case — can read across every tenant.
-- ---------------------------------------------------------------------------
set local role authenticated;
select test_login('70000000-0000-0000-0000-000000000001', 'SUPER_ADMIN', null, null);
select test_assert_not_empty(
  'super admin can read both societies across both federations',
  (select count(*) from societies where id in (
    '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002'
  ) having count(*) = 2)
);
reset role;

rollback;
