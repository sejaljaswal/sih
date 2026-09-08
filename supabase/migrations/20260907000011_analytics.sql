-- PRD §11.4 — given verbatim. Populated nightly; the forecasting model reads this
-- aggregate instead of scanning bookings (§11.4 note).
create table daily_demand_stats (
    id                     uuid primary key default gen_random_uuid(),
    society_id             uuid not null references societies(id),
    service_id             uuid not null references services(id),
    stat_date              date not null,
    bookings_requested     int not null default 0,
    bookings_fulfilled     int not null default 0,
    bookings_unfulfilled   int not null default 0,
    avg_response_seconds   int,
    revenue_paise          bigint not null default 0,
    created_at             timestamptz not null default now(),
    updated_at             timestamptz not null default now(),
    unique (society_id, service_id, stat_date)
);

create trigger trg_set_updated_at
    before update on daily_demand_stats
    for each row execute function set_updated_at();

create table demand_forecasts (
    id                   uuid primary key default gen_random_uuid(),
    society_id           uuid not null references societies(id),
    service_id           uuid not null references services(id),
    forecast_date        date not null,
    predicted_bookings   numeric(8,2) not null,
    lower_bound          numeric(8,2),
    upper_bound          numeric(8,2),
    workers_needed       int,
    model_version        varchar(50),
    generated_at         timestamptz not null default now(),
    created_at           timestamptz not null default now(),
    updated_at           timestamptz not null default now(),
    unique (society_id, service_id, forecast_date, model_version)
);

create trigger trg_set_updated_at
    before update on demand_forecasts
    for each row execute function set_updated_at();
