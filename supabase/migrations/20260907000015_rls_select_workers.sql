-- PRD §8.2 — Worker profiles row: Customer R (public fields, booking-linked),
-- Worker own R U, Society Admin C R U (soc), Federation Admin R (fed),
-- Super Admin R U D.
--
-- General pre-booking discovery (browsing candidate workers, distance, rating)
-- goes through find_candidate_workers() — a SECURITY DEFINER function called via
-- a server action (ARCHITECTURE-V2 §4) — not a raw client SELECT on this table.
-- So the customer policy below is deliberately booking-linked only.
create policy workers_select_own on workers for select using (
  user_id = auth.uid()
);

create policy workers_select_society_admin on workers for select using (
  society_id = auth_society_id()
);

create policy workers_select_federation_admin on workers for select using (
  society_id in (select id from societies where federation_id = auth_federation_id())
);

create policy workers_select_customer_booking_linked on workers for select using (
  id in (select worker_id from bookings where customer_id = auth.uid() and worker_id is not null)
);

create policy workers_select_super_admin on workers for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- PRD §8.2 — Worker documents row: Worker own C R, Society Admin R + Approve (soc),
-- Federation Admin R (fed), Super Admin R D. Never public (§8.3) — no customer
-- access at all.
--
-- §8.3 also requires every document view to be logged. RLS only gates row
-- visibility; the view-logging itself belongs in the signed-URL-issuing server
-- action, not here.
create policy worker_documents_select_own on worker_documents for select using (
  worker_id in (select id from workers where user_id = auth.uid())
);

create policy worker_documents_select_society_admin on worker_documents for select using (
  worker_id in (select id from workers where society_id = auth_society_id())
);

create policy worker_documents_select_federation_admin on worker_documents for select using (
  worker_id in (
    select w.id from workers w
    join societies s on s.id = w.society_id
    where s.federation_id = auth_federation_id()
  )
);

create policy worker_documents_select_super_admin on worker_documents for select using (
  auth_role() = 'SUPER_ADMIN'
);

-- PRD §8.2 — Worker skills row: Customer R (unscoped — public, like the catalog),
-- Worker own C R U, Society Admin R U + Approve (soc), Federation Admin R (fed),
-- Super Admin R U D.
create policy worker_skills_select_public on worker_skills for select to anon, authenticated using (
  true
);

-- Not in PRD §8.2 (added in PRD §11.5 as a Phase-1-unused table). No customer/
-- public role is defined for it yet, so it gets the same scoping as workers
-- itself rather than public access, until a real UX need is specified.
create policy worker_availability_select_own on worker_availability for select using (
  worker_id in (select id from workers where user_id = auth.uid())
);

create policy worker_availability_select_society_admin on worker_availability for select using (
  worker_id in (select id from workers where society_id = auth_society_id())
);

create policy worker_availability_select_federation_admin on worker_availability for select using (
  worker_id in (
    select w.id from workers w
    join societies s on s.id = w.society_id
    where s.federation_id = auth_federation_id()
  )
);

create policy worker_availability_select_super_admin on worker_availability for select using (
  auth_role() = 'SUPER_ADMIN'
);
