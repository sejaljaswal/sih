-- PRD §11.2 RATINGS. One rating per (booking, author) — a customer and worker each
-- rate the other once per completed job.
create table ratings (
    id           uuid primary key default gen_random_uuid(),
    booking_id   uuid not null references bookings(id),
    rated_by     uuid not null references profiles(id),
    rated_user   uuid not null references profiles(id),
    stars        int not null check (stars between 1 and 5),
    tags         jsonb,
    comment      text,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now(),
    unique (booking_id, rated_by)
);

create index idx_ratings_rated_user ON ratings (rated_user);
create index idx_ratings_booking    ON ratings (booking_id);

create trigger trg_set_updated_at
    before update on ratings
    for each row execute function set_updated_at();

-- PRD §11.2 WELFARE_CONTRIBUTIONS
create table welfare_contributions (
    id           uuid primary key default gen_random_uuid(),
    worker_id    uuid not null references workers(id),
    payment_id   uuid not null references payments(id),
    amount_paise bigint not null,
    scheme       text not null,
    status       welfare_contribution_status not null default 'CREDITED',
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create index idx_welfare_contributions_worker ON welfare_contributions (worker_id, created_at DESC);

create trigger trg_set_updated_at
    before update on welfare_contributions
    for each row execute function set_updated_at();

-- PRD §11.2 INSURANCE_POLICIES
create table insurance_policies (
    id             uuid primary key default gen_random_uuid(),
    worker_id      uuid not null references workers(id),
    scheme         text not null,
    policy_no      varchar(50) not null,
    coverage_paise bigint not null,
    valid_from     date not null,
    valid_to       date not null,
    status         insurance_status not null default 'ACTIVE',
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

create index idx_insurance_policies_worker ON insurance_policies (worker_id);

create trigger trg_set_updated_at
    before update on insurance_policies
    for each row execute function set_updated_at();
