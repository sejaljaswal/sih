-- PRD §8.2 — Payments row: Customer own R + initiate, Worker own R (earnings
-- view), Society Admin R (soc), Federation Admin R (fed, aggregate — raw scoped
-- read here; dashboard aggregation happens server-side on top of it),
-- Super Admin R U.
create policy payments_select_customer on payments for select using (
  booking_id in (select id from bookings where customer_id = auth.uid())
);

create policy payments_select_worker on payments for select using (
  booking_id in (
    select b.id from bookings b
    join workers w on w.id = b.worker_id
    where w.user_id = auth.uid()
  )
);

create policy payments_select_society_admin on payments for select using (
  booking_id in (select id from bookings where society_id = auth_society_id())
);

create policy payments_select_federation_admin on payments for select using (
  booking_id in (
    select id from bookings where society_id in (
      select id from societies where federation_id = auth_federation_id()
    )
  )
);

create policy payments_select_super_admin on payments for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- ARCHITECTURE-V2 §6.2 `payment_splits_select` — given verbatim, adapted to this
-- schema's table/column names.
create policy payment_splits_select on payment_splits for select using (
  payment_id in (
    select p.id from payments p join bookings b on b.id = p.booking_id
    where b.customer_id = auth.uid()
       or b.worker_id in (select id from workers where user_id = auth.uid())
       or (auth_role() = 'SOCIETY_ADMIN' and b.society_id = auth_society_id())
  )
);

create policy payment_splits_select_federation_admin on payment_splits for select using (
  payment_id in (
    select p.id from payments p join bookings b on b.id = p.booking_id
    where b.society_id in (select id from societies where federation_id = auth_federation_id())
  )
);

create policy payment_splits_select_super_admin on payment_splits for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- PRD §8.2 — Invoices row: Customer own R + download, Worker own R,
-- Society Admin R (soc), Federation Admin R (fed), Super Admin R.
create policy invoices_select_customer on invoices for select using (
  booking_id in (select id from bookings where customer_id = auth.uid())
);

create policy invoices_select_worker on invoices for select using (
  booking_id in (
    select b.id from bookings b
    join workers w on w.id = b.worker_id
    where w.user_id = auth.uid()
  )
);

create policy invoices_select_society_admin on invoices for select using (
  booking_id in (select id from bookings where society_id = auth_society_id())
);

create policy invoices_select_federation_admin on invoices for select using (
  booking_id in (
    select id from bookings where society_id in (
      select id from societies where federation_id = auth_federation_id()
    )
  )
);

create policy invoices_select_super_admin on invoices for select using (
  auth_role() = 'SUPER_ADMIN'
);
