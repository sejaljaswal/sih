-- PRD §11.3 — given verbatim
create type user_role as enum ('CUSTOMER','WORKER','SOCIETY_ADMIN','FEDERATION_ADMIN','SUPER_ADMIN');
create type verification_status as enum ('PENDING','UNDER_REVIEW','VERIFIED','REJECTED','SUSPENDED');
create type booking_status as enum
  ('REQUESTED','ASSIGNED','EN_ROUTE','ARRIVED','IN_PROGRESS','COMPLETED','PAID','CANCELLED','UNFULFILLED');
create type offer_response as enum ('PENDING','ACCEPTED','REJECTED','EXPIRED','REVOKED');
create type payment_status as enum ('CREATED','PENDING','CAPTURED','FAILED','REFUNDED');

-- Not enumerated explicitly in PRD §11.3; derived from the surrounding narrative.
-- worker_doc_type: PRD §7.2 "Upload documents: ID, society membership, skill certificate"
create type worker_doc_type as enum ('ID_PROOF','SOCIETY_MEMBERSHIP','SKILL_CERTIFICATE');

-- document_status: PRD §7.2 approve/reject-with-reason flow for a single uploaded document
-- (distinct from the worker-level verification_status above).
create type document_status as enum ('PENDING','APPROVED','REJECTED');

-- payment_method: PRD §1 "Razorpay Test Mode (UPI/card sandbox)"; §14.5 example shows "UPI".
create type payment_method as enum ('UPI','CARD');

-- welfare_contribution_status: contributions are credited synchronously with a captured
-- payment (PRD §9.5); REVERSED covers the payment_status REFUNDED case.
create type welfare_contribution_status as enum ('CREDITED','REVERSED');

-- insurance_status: PRD §14.5 example shows "ACTIVE"; EXPIRED/CANCELLED cover the
-- valid_from/valid_to lifecycle on insurance_policies.
create type insurance_status as enum ('ACTIVE','EXPIRED','CANCELLED');
