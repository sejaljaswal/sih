-- PRD §8.2 — Addresses row: Customer own C R U D, Worker R (assigned booking only,
-- after acceptance), else —.
create policy addresses_select_own on addresses for select using (
  user_id = auth.uid()
);

-- "After acceptance" = booking_status has moved past REQUESTED (ASSIGNED or later).
-- UNFULFILLED bookings never had a worker assigned, so they're excluded too.
create policy addresses_select_worker_assigned_booking on addresses for select using (
  id in (
    select b.address_id from bookings b
    join workers w on w.id = b.worker_id
    where w.user_id = auth.uid() and b.status not in ('REQUESTED', 'UNFULFILLED')
  )
);

create policy addresses_select_super_admin on addresses for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- ARCHITECTURE-V2 §6.2 `bookings_select_own` — given verbatim, adapted to this
-- schema's table/column names (auth_federation_id() added per the earlier note).
create policy bookings_select_own on bookings for select using (
     customer_id = auth.uid()
  or worker_id = my_worker_row_id()
  or (auth_role() = 'SOCIETY_ADMIN'    and society_id = auth_society_id())
  or (auth_role() = 'FEDERATION_ADMIN' and society_id in (
        select id from societies where federation_id = auth_federation_id()))
);

create policy bookings_select_super_admin on bookings for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- PRD §8.2 — Booking offers row: Customer —, Worker own R (+ U accept/reject,
-- via acceptOffer() server action), Society Admin R (soc), Federation Admin R
-- (fed), Super Admin R.
create policy booking_offers_select_own on booking_offers for select using (
  worker_id in (select id from workers where user_id = auth.uid())
);

create policy booking_offers_select_society_admin on booking_offers for select using (
  worker_id in (select id from workers where society_id = auth_society_id())
);

create policy booking_offers_select_federation_admin on booking_offers for select using (
  worker_id in (
    select w.id from workers w
    join societies s on s.id = w.society_id
    where s.federation_id = auth_federation_id()
  )
);

create policy booking_offers_select_super_admin on booking_offers for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- Not in PRD §8.2 (it's the audit trail behind a booking, from PRD §11.2). Same
-- visibility as the parent booking — if you can see the booking, you can see its
-- status history.
create policy booking_status_history_select_visible_booking on booking_status_history for select using (
  booking_id in (
    select id from bookings where
         customer_id = auth.uid()
      or worker_id = my_worker_row_id()
      or (auth_role() = 'SOCIETY_ADMIN'    and society_id = auth_society_id())
      or (auth_role() = 'FEDERATION_ADMIN' and society_id in (
            select id from societies where federation_id = auth_federation_id()))
  )
);

create policy booking_status_history_select_super_admin on booking_status_history for select using (
  auth_role() = 'SUPER_ADMIN'
);
