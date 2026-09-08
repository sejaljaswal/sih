-- PRD §11.3 — given verbatim, with users(id) -> profiles(id) per the profiles migration note.
create table bookings (
    id                   uuid primary key default gen_random_uuid(),
    booking_code         varchar(20) not null unique,          -- SHY-2026-000123
    customer_id          uuid not null references profiles(id),
    service_id           uuid not null references services(id),
    address_id           uuid not null references addresses(id),
    society_id           uuid not null references societies(id),
    worker_id            uuid references workers(id),
    status               booking_status not null default 'REQUESTED',
    is_emergency         boolean not null default false,
    scheduled_at         timestamptz,
    quoted_price_paise   bigint not null,
    materials_cost_paise bigint not null default 0,
    final_price_paise    bigint,
    rate_snapshot        jsonb not null,   -- the full rate card at booking time
    start_otp            char(4),
    customer_notes       text,
    started_at           timestamptz,
    completed_at         timestamptz,
    created_at           timestamptz not null default now(),
    updated_at           timestamptz not null default now()
);

create index idx_bookings_customer  ON bookings (customer_id, created_at DESC);
create index idx_bookings_worker    ON bookings (worker_id, status);
create index idx_bookings_society   ON bookings (society_id, created_at DESC);
create index idx_bookings_forecast  ON bookings (society_id, service_id, created_at);

create trigger trg_set_updated_at
    before update on bookings
    for each row execute function set_updated_at();

-- PRD §11.2 BOOKING_OFFERS. score_breakdown is always populated — CLAUDE.md rule #9.
create table booking_offers (
    id               uuid primary key default gen_random_uuid(),
    booking_id       uuid not null references bookings(id) on delete cascade,
    worker_id        uuid not null references workers(id),
    rank_position    int not null,
    match_score      numeric(5,4) not null,
    score_breakdown  jsonb not null,
    distance_m       int not null,
    response         offer_response not null default 'PENDING',
    sent_at          timestamptz not null default now(),
    expires_at       timestamptz not null,
    responded_at     timestamptz,
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now()
);

-- Realtime delivery to a worker's offer feed filters on worker_id (ARCHITECTURE-V2 §7.3).
create index idx_booking_offers_worker  ON booking_offers (worker_id, response);
create index idx_booking_offers_booking ON booking_offers (booking_id);

create trigger trg_set_updated_at
    before update on booking_offers
    for each row execute function set_updated_at();

-- PRD §11.2 BOOKING_STATUS_HISTORY — append-only audit log.
create table booking_status_history (
    id           uuid primary key default gen_random_uuid(),
    booking_id   uuid not null references bookings(id) on delete cascade,
    from_status  booking_status,
    to_status    booking_status not null,
    changed_by   uuid references profiles(id),
    reason       text,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create index idx_booking_status_history_booking ON booking_status_history (booking_id, created_at);

create trigger trg_set_updated_at
    before update on booking_status_history
    for each row execute function set_updated_at();
