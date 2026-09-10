-- Demo seed data for Sahaayak.
--
-- Prerequisite: the auth users below must already exist (created via the
-- Supabase Admin API with app_metadata.role set, so handle_new_user
-- provisions their profiles row -- see supabase/migrations/20260910000001).
-- This script only fills public-schema reference/demo data; it never
-- touches auth.users.
--
--   role            phone         name             auth.users.id
--   CUSTOMER        9123456780    Test User        2ce97f2b-302a-49ac-813f-3d6eb5ba976c
--   WORKER          9000000010    Ramesh Kumar     f9790da0-2c07-42c5-a919-f3e4eced651b
--   WORKER          9000000011    Sunita Devi      1752e25b-9a05-46dd-bd11-a09cf80c66b3
--   WORKER          9000000012    Mohan Lal        c765d8f0-3479-4f29-ac60-13126a459640
--   WORKER          9000000013    Kavita Sharma    bad9c73c-8e47-42e3-89e5-ea192df7cbe7
--   WORKER          9000000014    Suresh Thakur    76c73709-476e-4d44-bd9d-a4b5a3d6258d
--   WORKER          9000000015    Anita Rana       ee701493-84be-4ffd-a508-7c2ca7129004
--   WORKER          9000000001    Test WORKER      71a45643-662e-43a1-b194-a65835af90e2
--   SOCIETY_ADMIN   9000000002    Test SOCIETY_ADMIN     1dab188a-7efe-4425-b383-9dc7f00a3631
--   FEDERATION_ADMIN 9000000003   Test FEDERATION_ADMIN  fa53a9ac-ae04-4115-b6a1-6e73d6522fb9
--
-- All test accounts use password TestPass123! (login uses the phone above).
--
-- Idempotent: fixed UUIDs + ON CONFLICT DO NOTHING, safe to re-run.

begin;

-- ── Federation & societies ──────────────────────────────────────────────
insert into federations (id, name, state, code) values
  ('a0000000-0000-0000-0000-000000000001', 'Himachal Pradesh State Federation', 'Himachal Pradesh', 'HP-FED-01')
on conflict (id) do nothing;

insert into societies (id, federation_id, name, registration_no, district, location, service_radius_km) values
  ('a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001',
   'Shimla Shram Sahakari Society', 'HP/COOP/2019/104', 'Shimla',
   extensions.ST_SetSRID(extensions.ST_MakePoint(77.1734, 31.1048), 4326)::extensions.geography, 15),
  ('a0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000001',
   'Kufri Cooperative Society', 'HP/COOP/2020/211', 'Shimla',
   extensions.ST_SetSRID(extensions.ST_MakePoint(77.2653, 31.0997), 4326)::extensions.geography, 15)
on conflict (id) do nothing;

-- ── Catalogue: categories, skills, services ─────────────────────────────
insert into service_categories (id, name_key, icon, display_order) values
  ('a0000000-0000-0000-0000-000000000101', 'electrical', '⚡', 1),
  ('a0000000-0000-0000-0000-000000000102', 'plumbing',   '🔧', 2),
  ('a0000000-0000-0000-0000-000000000103', 'cleaning',   '🧹', 3),
  ('a0000000-0000-0000-0000-000000000104', 'carpentry',  '🪚', 4),
  ('a0000000-0000-0000-0000-000000000105', 'care',       '🫂', 5),
  ('a0000000-0000-0000-0000-000000000106', 'painting',   '🎨', 6)
on conflict (id) do nothing;

insert into skills (id, name_key, category_id) values
  ('a0000000-0000-0000-0000-000000000201', 'electrician', 'a0000000-0000-0000-0000-000000000101'),
  ('a0000000-0000-0000-0000-000000000202', 'plumber',     'a0000000-0000-0000-0000-000000000102'),
  ('a0000000-0000-0000-0000-000000000203', 'cleaner',     'a0000000-0000-0000-0000-000000000103'),
  ('a0000000-0000-0000-0000-000000000204', 'carpenter',   'a0000000-0000-0000-0000-000000000104'),
  ('a0000000-0000-0000-0000-000000000205', 'caregiver',   'a0000000-0000-0000-0000-000000000105'),
  ('a0000000-0000-0000-0000-000000000206', 'painter',     'a0000000-0000-0000-0000-000000000106')
on conflict (id) do nothing;

insert into services (id, category_id, name_key, required_skill_id, default_duration_min, emergency_enabled) values
  ('a0000000-0000-0000-0000-000000000301', 'a0000000-0000-0000-0000-000000000101', 'fan_repair',       'a0000000-0000-0000-0000-000000000201', 45, true),
  ('a0000000-0000-0000-0000-000000000302', 'a0000000-0000-0000-0000-000000000102', 'tap_repair',       'a0000000-0000-0000-0000-000000000202', 40, true),
  ('a0000000-0000-0000-0000-000000000303', 'a0000000-0000-0000-0000-000000000103', 'home_cleaning',    'a0000000-0000-0000-0000-000000000203', 90, false),
  ('a0000000-0000-0000-0000-000000000304', 'a0000000-0000-0000-0000-000000000104', 'furniture_repair', 'a0000000-0000-0000-0000-000000000204', 60, false),
  ('a0000000-0000-0000-0000-000000000305', 'a0000000-0000-0000-0000-000000000105', 'elder_care',       'a0000000-0000-0000-0000-000000000205', 240, false),
  ('a0000000-0000-0000-0000-000000000306', 'a0000000-0000-0000-0000-000000000106', 'wall_painting',    'a0000000-0000-0000-0000-000000000206', 180, false)
on conflict (id) do nothing;

-- ── Rate cards: one per society x service ───────────────────────────────
insert into society_service_rates
  (society_id, service_id, customer_price_paise, floor_wage_paise, commission_pct, welfare_pct, platform_pct, emergency_surcharge_pct)
select s.id, v.service_id, v.price, (v.price * 0.70)::bigint, 10, 3, 1, v.surcharge
from societies s
cross join (values
  ('a0000000-0000-0000-0000-000000000301'::uuid, 30000::bigint, 20),
  ('a0000000-0000-0000-0000-000000000302'::uuid, 25000::bigint, 20),
  ('a0000000-0000-0000-0000-000000000303'::uuid, 40000::bigint, 0),
  ('a0000000-0000-0000-0000-000000000304'::uuid, 35000::bigint, 0),
  ('a0000000-0000-0000-0000-000000000305'::uuid, 50000::bigint, 0),
  ('a0000000-0000-0000-0000-000000000306'::uuid, 60000::bigint, 0)
) as v(service_id, price, surcharge)
where s.id in ('a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000012')
on conflict do nothing;

-- ── Workers ──────────────────────────────────────────────────────────────
-- profiles.society_id is set here (self-registration never sets it).
update profiles set society_id = 'a0000000-0000-0000-0000-000000000011'
where id in (
  'f9790da0-2c07-42c5-a919-f3e4eced651b', '1752e25b-9a05-46dd-bd11-a09cf80c66b3',
  'c765d8f0-3479-4f29-ac60-13126a459640', '71a45643-662e-43a1-b194-a65835af90e2'
);
update profiles set society_id = 'a0000000-0000-0000-0000-000000000012'
where id in (
  'bad9c73c-8e47-42e3-89e5-ea192df7cbe7', '76c73709-476e-4d44-bd9d-a4b5a3d6258d',
  'ee701493-84be-4ffd-a508-7c2ca7129004'
);
update profiles set society_id = 'a0000000-0000-0000-0000-000000000011'
where id = '1dab188a-7efe-4425-b383-9dc7f00a3631';
update profiles set federation_id = 'a0000000-0000-0000-0000-000000000001'
where id = 'fa53a9ac-ae04-4115-b6a1-6e73d6522fb9';

insert into workers
  (id, user_id, society_id, membership_no, verification_status, base_location, service_radius_km,
   is_available, rating_avg, total_ratings, jobs_completed, jobs_last_7d, verified_at, verified_by)
values
  ('a0000000-0000-0000-0000-000000000401', 'f9790da0-2c07-42c5-a919-f3e4eced651b', 'a0000000-0000-0000-0000-000000000011',
   'SSS-0104', 'VERIFIED', extensions.ST_SetSRID(extensions.ST_MakePoint(77.1690, 31.1030), 4326)::extensions.geography,
   10, true, 4.8, 62, 58, 4, now() - interval '90 days', '1dab188a-7efe-4425-b383-9dc7f00a3631'),
  ('a0000000-0000-0000-0000-000000000402', '1752e25b-9a05-46dd-bd11-a09cf80c66b3', 'a0000000-0000-0000-0000-000000000011',
   'SSS-0105', 'VERIFIED', extensions.ST_SetSRID(extensions.ST_MakePoint(77.1780, 31.1070), 4326)::extensions.geography,
   10, true, 4.6, 41, 37, 2, now() - interval '60 days', '1dab188a-7efe-4425-b383-9dc7f00a3631'),
  ('a0000000-0000-0000-0000-000000000403', 'c765d8f0-3479-4f29-ac60-13126a459640', 'a0000000-0000-0000-0000-000000000011',
   'SSS-0106', 'UNDER_REVIEW', extensions.ST_SetSRID(extensions.ST_MakePoint(77.2100, 31.1200), 4326)::extensions.geography,
   10, false, 0, 0, 0, 0, null, null),
  ('a0000000-0000-0000-0000-000000000404', 'bad9c73c-8e47-42e3-89e5-ea192df7cbe7', 'a0000000-0000-0000-0000-000000000012',
   'KCS-0201', 'VERIFIED', extensions.ST_SetSRID(extensions.ST_MakePoint(77.2640, 31.0980), 4326)::extensions.geography,
   10, true, 4.9, 88, 80, 5, now() - interval '120 days', '1dab188a-7efe-4425-b383-9dc7f00a3631'),
  ('a0000000-0000-0000-0000-000000000405', '76c73709-476e-4d44-bd9d-a4b5a3d6258d', 'a0000000-0000-0000-0000-000000000012',
   'KCS-0202', 'PENDING', extensions.ST_SetSRID(extensions.ST_MakePoint(77.2700, 31.1010), 4326)::extensions.geography,
   10, false, 0, 0, 0, 0, null, null),
  ('a0000000-0000-0000-0000-000000000406', 'ee701493-84be-4ffd-a508-7c2ca7129004', 'a0000000-0000-0000-0000-000000000012',
   'KCS-0203', 'VERIFIED', extensions.ST_SetSRID(extensions.ST_MakePoint(77.2610, 31.1030), 4326)::extensions.geography,
   10, true, 4.7, 29, 26, 1, now() - interval '45 days', '1dab188a-7efe-4425-b383-9dc7f00a3631'),
  ('a0000000-0000-0000-0000-000000000407', '71a45643-662e-43a1-b194-a65835af90e2', 'a0000000-0000-0000-0000-000000000011',
   'SSS-0107', 'VERIFIED', extensions.ST_SetSRID(extensions.ST_MakePoint(77.1734, 31.1048), 4326)::extensions.geography,
   10, true, 4.5, 12, 10, 3, now() - interval '20 days', '1dab188a-7efe-4425-b383-9dc7f00a3631')
on conflict (id) do nothing;

insert into worker_skills (worker_id, skill_id, years_experience, society_certified) values
  ('a0000000-0000-0000-0000-000000000401', 'a0000000-0000-0000-0000-000000000201', 15, true),
  ('a0000000-0000-0000-0000-000000000402', 'a0000000-0000-0000-0000-000000000201', 8, true),
  ('a0000000-0000-0000-0000-000000000403', 'a0000000-0000-0000-0000-000000000202', 5, false),
  ('a0000000-0000-0000-0000-000000000404', 'a0000000-0000-0000-0000-000000000203', 6, true),
  ('a0000000-0000-0000-0000-000000000405', 'a0000000-0000-0000-0000-000000000204', 3, false),
  ('a0000000-0000-0000-0000-000000000406', 'a0000000-0000-0000-0000-000000000205', 7, true),
  ('a0000000-0000-0000-0000-000000000407', 'a0000000-0000-0000-0000-000000000201', 4, true)
on conflict do nothing;

insert into worker_documents (worker_id, doc_type, file_path, status) values
  ('a0000000-0000-0000-0000-000000000403', 'ID_PROOF', 'demo/mohan-id.pdf', 'PENDING'),
  ('a0000000-0000-0000-0000-000000000403', 'SOCIETY_MEMBERSHIP', 'demo/mohan-membership.pdf', 'PENDING'),
  ('a0000000-0000-0000-0000-000000000405', 'ID_PROOF', 'demo/suresh-id.pdf', 'PENDING')
on conflict do nothing;

-- ── Customer address ─────────────────────────────────────────────────────
insert into addresses (id, user_id, label, line1, city, pincode, location, is_default) values
  ('a0000000-0000-0000-0000-000000000501', '2ce97f2b-302a-49ac-813f-3d6eb5ba976c', 'Home',
   '14 Sanjauli Chowk', 'Shimla', '171006',
   extensions.ST_SetSRID(extensions.ST_MakePoint(77.1734, 31.1048), 4326)::extensions.geography, true)
on conflict (id) do nothing;

-- ── Bookings across the lifecycle ───────────────────────────────────────
insert into bookings
  (id, booking_code, customer_id, service_id, address_id, society_id, worker_id, status,
   scheduled_at, quoted_price_paise, final_price_paise, rate_snapshot, start_otp, started_at, completed_at)
values
  ('a0000000-0000-0000-0000-000000000601', 'SAH-100001', '2ce97f2b-302a-49ac-813f-3d6eb5ba976c',
   'a0000000-0000-0000-0000-000000000301', 'a0000000-0000-0000-0000-000000000501',
   'a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000401', 'PAID',
   now() - interval '5 days', 30000, 30000,
   '{"customer_price_paise":30000,"worker_paise":25800,"society_commission_paise":3000,"welfare_paise":900,"platform_paise":300}',
   '4821', now() - interval '5 days' + interval '20 minutes', now() - interval '5 days' + interval '55 minutes'),
  ('a0000000-0000-0000-0000-000000000602', 'SAH-100002', '2ce97f2b-302a-49ac-813f-3d6eb5ba976c',
   'a0000000-0000-0000-0000-000000000302', 'a0000000-0000-0000-0000-000000000501',
   'a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000402', 'IN_PROGRESS',
   now() - interval '30 minutes', 25000, null,
   '{"customer_price_paise":25000,"worker_paise":21500,"society_commission_paise":2500,"welfare_paise":750,"platform_paise":250}',
   '7734', now() - interval '10 minutes', null),
  ('a0000000-0000-0000-0000-000000000603', 'SAH-100003', '2ce97f2b-302a-49ac-813f-3d6eb5ba976c',
   'a0000000-0000-0000-0000-000000000303', 'a0000000-0000-0000-0000-000000000501',
   'a0000000-0000-0000-0000-000000000011', null, 'REQUESTED',
   now() + interval '1 day', 40000, null,
   '{"customer_price_paise":40000,"worker_paise":34400,"society_commission_paise":4000,"welfare_paise":1200,"platform_paise":400}',
   null, null, null)
on conflict (id) do nothing;

insert into booking_offers (booking_id, worker_id, rank_position, match_score, score_breakdown, distance_m, response, sent_at, expires_at, responded_at) values
  ('a0000000-0000-0000-0000-000000000601', 'a0000000-0000-0000-0000-000000000401', 1, 0.94,
   '{"distance":0.98,"rating":0.96,"fairness":0.88}', 480, 'ACCEPTED',
   now() - interval '5 days' - interval '2 minutes', now() - interval '5 days' - interval '1 minute', now() - interval '5 days' - interval '90 seconds'),
  ('a0000000-0000-0000-0000-000000000602', 'a0000000-0000-0000-0000-000000000402', 1, 0.91,
   '{"distance":0.90,"rating":0.92,"fairness":0.91}', 610, 'ACCEPTED',
   now() - interval '35 minutes', now() - interval '25 minutes', now() - interval '32 minutes')
on conflict do nothing;

insert into ratings (booking_id, rated_by, rated_user, stars, tags, comment) values
  ('a0000000-0000-0000-0000-000000000601', '2ce97f2b-302a-49ac-813f-3d6eb5ba976c',
   'f9790da0-2c07-42c5-a919-f3e4eced651b', 5, '["on_time","polite"]', 'Fixed the fan quickly, very professional.')
on conflict do nothing;

insert into payments (id, booking_id, provider, provider_order_id, provider_payment_id, amount_paise, method, status, paid_at) values
  ('a0000000-0000-0000-0000-000000000701', 'a0000000-0000-0000-0000-000000000601', 'razorpay',
   'order_demo_100001', 'pay_demo_100001', 30000, 'UPI', 'CAPTURED', now() - interval '5 days' + interval '56 minutes')
on conflict (id) do nothing;

insert into payment_splits (payment_id, worker_amount_paise, society_commission_paise, welfare_amount_paise, platform_fee_paise, calculation_snapshot) values
  ('a0000000-0000-0000-0000-000000000701', 25800, 3000, 900, 300,
   '{"customer_price_paise":30000,"commission_pct":10,"welfare_pct":3,"platform_pct":1}')
on conflict do nothing;

insert into welfare_contributions (worker_id, payment_id, amount_paise, scheme, status) values
  ('a0000000-0000-0000-0000-000000000401', 'a0000000-0000-0000-0000-000000000701', 900, 'e-Shram Welfare Fund', 'CREDITED')
on conflict do nothing;

insert into invoices (booking_id, invoice_no, pdf_path) values
  ('a0000000-0000-0000-0000-000000000601', 'INV-2026-100001', 'demo/invoice-100001.pdf')
on conflict do nothing;

insert into insurance_policies (worker_id, scheme, policy_no, coverage_paise, valid_from, valid_to, status) values
  ('a0000000-0000-0000-0000-000000000401', 'PM Suraksha Bima Yojana', 'PMSBY-HP-0104', 200000000, current_date - interval '90 days', current_date + interval '275 days', 'ACTIVE'),
  ('a0000000-0000-0000-0000-000000000404', 'PM Suraksha Bima Yojana', 'PMSBY-HP-0201', 200000000, current_date - interval '120 days', current_date + interval '245 days', 'ACTIVE')
on conflict do nothing;

-- ── Analytics: last 7 days of demand per society/service ───────────────
insert into daily_demand_stats (society_id, service_id, stat_date, bookings_requested, bookings_fulfilled, bookings_unfulfilled, avg_response_seconds, revenue_paise)
select s.id, v.service_id, (current_date - d.n), v.requested, v.fulfilled, v.requested - v.fulfilled, v.avg_resp, v.fulfilled * v.price
from societies s
cross join generate_series(0, 6) as d(n)
cross join (values
  ('a0000000-0000-0000-0000-000000000301'::uuid, 6, 5, 42, 30000::bigint),
  ('a0000000-0000-0000-0000-000000000302'::uuid, 4, 4, 38, 25000::bigint),
  ('a0000000-0000-0000-0000-000000000303'::uuid, 3, 3, 55, 40000::bigint)
) as v(service_id, requested, fulfilled, avg_resp, price)
where s.id in ('a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000012')
on conflict do nothing;

insert into demand_forecasts (society_id, service_id, forecast_date, predicted_bookings, lower_bound, upper_bound, workers_needed, model_version)
select s.id, 'a0000000-0000-0000-0000-000000000301', current_date + d.n, 6.2, 4.0, 8.5, 3, 'v1-demo'
from societies s
cross join generate_series(1, 7) as d(n)
where s.id in ('a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000012')
on conflict do nothing;

commit;
