create table federations (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    state       text not null,
    code        varchar(20) not null unique,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create trigger trg_set_updated_at
    before update on federations
    for each row execute function set_updated_at();

create table societies (
    id                  uuid primary key default gen_random_uuid(),
    federation_id       uuid not null references federations(id),
    name                text not null,
    registration_no     varchar(50) not null unique,
    district            text not null,
    location            geography(Point,4326),
    service_radius_km   int not null default 10,
    is_active           boolean not null default true,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);

create index idx_societies_federation ON societies (federation_id);
create index idx_societies_location   ON societies USING GIST (location);

create trigger trg_set_updated_at
    before update on societies
    for each row execute function set_updated_at();
