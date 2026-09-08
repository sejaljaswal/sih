-- PRD §11.3 — given verbatim, with users(id) -> profiles(id) per the profiles migration note.
create table workers (
    id                  uuid primary key default gen_random_uuid(),
    user_id             uuid not null unique references profiles(id) on delete cascade,
    society_id          uuid not null references societies(id),
    membership_no       varchar(50),
    verification_status verification_status not null default 'PENDING',
    base_location       geography(Point,4326),
    service_radius_km   int not null default 10,
    is_available        boolean not null default false,
    rating_avg          numeric(3,2) not null default 0,
    total_ratings       int not null default 0,
    jobs_completed      int not null default 0,
    jobs_last_7d        int not null default 0,   -- fairness input, refreshed nightly
    acceptance_rate     numeric(4,3) not null default 1.000,
    eshram_id           varchar(20),
    upi_vpa             varchar(100),
    verified_at         timestamptz,
    verified_by         uuid references profiles(id),
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    deleted_at          timestamptz
);

-- The index that makes the whole product work
create index idx_workers_location   ON workers USING GIST (base_location);
create index idx_workers_dispatch   ON workers (society_id, verification_status, is_available)
    where deleted_at is null;

create trigger trg_set_updated_at
    before update on workers
    for each row execute function set_updated_at();

-- PRD §11.2 WORKER_DOCUMENTS
create table worker_documents (
    id                 uuid primary key default gen_random_uuid(),
    worker_id          uuid not null references workers(id) on delete cascade,
    doc_type           worker_doc_type not null,
    file_path          text not null,
    status             document_status not null default 'PENDING',
    rejection_reason   text,
    reviewed_by        uuid references profiles(id),
    reviewed_at        timestamptz,
    created_at         timestamptz not null default now(),
    updated_at         timestamptz not null default now()
);

create index idx_worker_documents_worker ON worker_documents (worker_id, status);

create trigger trg_set_updated_at
    before update on worker_documents
    for each row execute function set_updated_at();

-- PRD §11.2 WORKER_SKILLS
create table worker_skills (
    id                  uuid primary key default gen_random_uuid(),
    worker_id           uuid not null references workers(id) on delete cascade,
    skill_id            uuid not null references skills(id),
    years_experience    int not null default 0,
    society_certified   boolean not null default false,
    certificate_path    text,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    unique (worker_id, skill_id)
);

-- Used directly by find_candidate_workers() (ARCHITECTURE-V2 §4): joins on
-- worker_id + skill_id to find candidates for a requested service.
create index idx_worker_skills_skill ON worker_skills (skill_id, worker_id);

create trigger trg_set_updated_at
    before update on worker_skills
    for each row execute function set_updated_at();

-- PRD §11.2 WORKER_AVAILABILITY — unused in Phase 1, table exists from day one (§11.5)
create table worker_availability (
    id           uuid primary key default gen_random_uuid(),
    worker_id    uuid not null references workers(id) on delete cascade,
    day_of_week  int not null check (day_of_week between 0 and 6),
    start_time   time not null,
    end_time     time not null,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create index idx_worker_availability_worker ON worker_availability (worker_id);

create trigger trg_set_updated_at
    before update on worker_availability
    for each row execute function set_updated_at();
