-- PRD §8.2 RBAC matrix — Federations row: Customer —, Worker —,
-- Society Admin R (own), Federation Admin R (own), Super Admin R.
create policy federations_select_own_society_admin on federations for select using (
  id = (select federation_id from societies where id = auth_society_id())
);

create policy federations_select_own_federation_admin on federations for select using (
  id = auth_federation_id()
);

create policy federations_select_super_admin on federations for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- PRD §8.2 — Societies row: Customer R (list), Worker R (own),
-- Society Admin R U (own), Federation Admin C R U (fed), Super Admin C R U D.
-- "Customer R (list)" is public catalog browsing — no login required.
create policy societies_select_public on societies for select to anon, authenticated using (
  is_active
);

create policy societies_select_own_worker on societies for select using (
  id = my_society_id()
);

create policy societies_select_own_admin on societies for select using (
  id = auth_society_id()
);

create policy societies_select_federation_admin on societies for select using (
  federation_id = auth_federation_id()
);

create policy societies_select_super_admin on societies for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- PRD §8.2 — Own profile row (R U, every role) + Customer profiles row
-- (Customer: own; Society Admin: R soc, booking-linked; Federation Admin: R fed,
-- aggregate — aggregate implies server-computed, so no raw federation-wide row
-- access here) + Worker profiles row (Customer: R public fields, booking-linked;
-- Worker: own; Society Admin: R soc; Federation Admin: R fed).
--
-- RLS is row-level, not column-level: it cannot itself restrict a customer to
-- "public fields only" of a worker's profile. Contact fields that must stay
-- masked until a booking reaches ASSIGNED (§8.3) are delivered through a server
-- action using the service-role client, never a raw client read of this table.
create policy profiles_select_own on profiles for select using (
  id = auth.uid()
);

create policy profiles_select_society_admin_workers on profiles for select using (
  id in (select user_id from workers where society_id = auth_society_id())
);

create policy profiles_select_society_admin_customers_booking_linked on profiles for select using (
  id in (select customer_id from bookings where society_id = auth_society_id())
);

create policy profiles_select_federation_admin_workers on profiles for select using (
  id in (
    select w.user_id from workers w
    join societies s on s.id = w.society_id
    where s.federation_id = auth_federation_id()
  )
);

create policy profiles_select_customer_of_own_booking_worker on profiles for select using (
  id in (
    select w.user_id from workers w
    join bookings b on b.worker_id = w.id
    where b.customer_id = auth.uid()
  )
);

create policy profiles_select_worker_of_own_booking_customer on profiles for select using (
  id in (
    select b.customer_id from bookings b
    join workers w on w.id = b.worker_id
    where w.user_id = auth.uid() and b.status <> 'REQUESTED'
  )
);

create policy profiles_select_super_admin on profiles for select using (
  auth_role() = 'SUPER_ADMIN'
);
