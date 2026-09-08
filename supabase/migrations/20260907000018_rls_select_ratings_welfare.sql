-- PRD §8.2 — Ratings row: Customer C (own bookings) R, Worker C (own bookings) R,
-- Society Admin R (soc) + moderate, Federation Admin R (fed), Super Admin R U D.
create policy ratings_select_participant on ratings for select using (
  rated_by = auth.uid() or rated_user = auth.uid()
);

create policy ratings_select_society_admin on ratings for select using (
  booking_id in (select id from bookings where society_id = auth_society_id())
);

create policy ratings_select_federation_admin on ratings for select using (
  booking_id in (
    select id from bookings where society_id in (
      select id from societies where federation_id = auth_federation_id()
    )
  )
);

create policy ratings_select_super_admin on ratings for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- PRD §8.2 — Welfare ledger row: Customer —, Worker own R, Society Admin R (soc),
-- Federation Admin R (fed), Super Admin R U.
create policy welfare_contributions_select_own on welfare_contributions for select using (
  worker_id in (select id from workers where user_id = auth.uid())
);

create policy welfare_contributions_select_society_admin on welfare_contributions for select using (
  worker_id in (select id from workers where society_id = auth_society_id())
);

create policy welfare_contributions_select_federation_admin on welfare_contributions for select using (
  worker_id in (
    select w.id from workers w
    join societies s on s.id = w.society_id
    where s.federation_id = auth_federation_id()
  )
);

create policy welfare_contributions_select_super_admin on welfare_contributions for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- PRD §8.2 — Insurance policies row: Customer —, Worker own R,
-- Society Admin C R U (soc), Federation Admin R (fed), Super Admin R U D.
create policy insurance_policies_select_own on insurance_policies for select using (
  worker_id in (select id from workers where user_id = auth.uid())
);

create policy insurance_policies_select_society_admin on insurance_policies for select using (
  worker_id in (select id from workers where society_id = auth_society_id())
);

create policy insurance_policies_select_federation_admin on insurance_policies for select using (
  worker_id in (
    select w.id from workers w
    join societies s on s.id = w.society_id
    where s.federation_id = auth_federation_id()
  )
);

create policy insurance_policies_select_super_admin on insurance_policies for select using (
  auth_role() = 'SUPER_ADMIN'
);
