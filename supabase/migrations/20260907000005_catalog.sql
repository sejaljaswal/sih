create table service_categories (
    id             uuid primary key default gen_random_uuid(),
    name_key       text not null,
    icon           text,
    display_order  int not null default 0,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

create trigger trg_set_updated_at
    before update on service_categories
    for each row execute function set_updated_at();

create table skills (
    id           uuid primary key default gen_random_uuid(),
    name_key     text not null,
    category_id  uuid references service_categories(id),
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create index idx_skills_category ON skills (category_id);

create trigger trg_set_updated_at
    before update on skills
    for each row execute function set_updated_at();

create table services (
    id                     uuid primary key default gen_random_uuid(),
    category_id            uuid not null references service_categories(id),
    name_key               text not null,
    required_skill_id      uuid references skills(id),
    default_duration_min   int not null default 60,
    emergency_enabled      boolean not null default false,
    is_active              boolean not null default true,
    created_at             timestamptz not null default now(),
    updated_at             timestamptz not null default now()
);

create index idx_services_category ON services (category_id);
create index idx_services_skill    ON services (required_skill_id);

create trigger trg_set_updated_at
    before update on services
    for each row execute function set_updated_at();
