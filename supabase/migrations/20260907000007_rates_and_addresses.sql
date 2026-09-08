-- PRD §11.2 SOCIETY_SERVICE_RATES. Only one rate card is active per (society, service)
-- at a time; is_active false rows are kept as history rather than deleted.
create table society_service_rates (
    id                          uuid primary key default gen_random_uuid(),
    society_id                  uuid not null references societies(id),
    service_id                  uuid not null references services(id),
    customer_price_paise        bigint not null,
    floor_wage_paise            bigint not null,
    commission_pct              numeric(5,2) not null,
    welfare_pct                 numeric(5,2) not null,
    platform_pct                numeric(5,2) not null,
    emergency_surcharge_pct     numeric(5,2) not null default 0,
    is_active                   boolean not null default true,
    created_at                  timestamptz not null default now(),
    updated_at                  timestamptz not null default now()
);

create index idx_society_service_rates_lookup ON society_service_rates (society_id, service_id)
    where is_active;
-- At most one active rate card per society/service pair.
create unique index idx_society_service_rates_active_unique
    ON society_service_rates (society_id, service_id) where is_active;

create trigger trg_set_updated_at
    before update on society_service_rates
    for each row execute function set_updated_at();

-- PRD §11.2 ADDRESSES
create table addresses (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references profiles(id) on delete cascade,
    label       text,
    line1       text not null,
    city        text not null,
    pincode     varchar(10) not null,
    location    geography(Point,4326) not null,
    is_default  boolean not null default false,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now(),
    deleted_at  timestamptz
);

create index idx_addresses_user     ON addresses (user_id) where deleted_at is null;
create index idx_addresses_location ON addresses USING GIST (location);

create trigger trg_set_updated_at
    before update on addresses
    for each row execute function set_updated_at();
