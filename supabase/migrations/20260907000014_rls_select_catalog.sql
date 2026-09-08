-- PRD §8.2 — Skills catalogue / Service categories / Services rows: every role
-- gets unscoped R (Super Admin additionally gets CRUD, handled by server actions).
-- This is public marketplace catalog, browsable before login.
create policy service_categories_select_public on service_categories for select to anon, authenticated using (
  true
);

create policy skills_select_public on skills for select to anon, authenticated using (
  true
);

create policy services_select_public on services for select to anon, authenticated using (
  is_active
);

create policy services_select_admin_inactive on services for select using (
  auth_role() in ('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN')
);

-- PRD §8.2 — Society rate cards row: Customer R (price only), Worker R (own wage),
-- Society Admin C R U (soc), Federation Admin R + Approve (fed), Super Admin R U.
--
-- Customer/worker price and wage figures are never read from this table directly —
-- CLAUDE.md rule #5: prices are computed server-side and the rate card is
-- snapshotted onto bookings.rate_snapshot at booking time. The client reads its
-- price/wage from that snapshot (via the booking it can already see), not from a
-- live, mutable rate card. So only the roles that manage rate cards get direct
-- table access here.
create policy society_service_rates_select_own_admin on society_service_rates for select using (
  society_id = auth_society_id()
);

create policy society_service_rates_select_federation_admin on society_service_rates for select using (
  society_id in (select id from societies where federation_id = auth_federation_id())
);

create policy society_service_rates_select_super_admin on society_service_rates for select using (
  auth_role() = 'SUPER_ADMIN'
);
