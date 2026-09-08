-- PRD §11.2 PAYMENTS
create table payments (
    id                    uuid primary key default gen_random_uuid(),
    booking_id            uuid not null unique references bookings(id),
    provider              text not null default 'razorpay',
    provider_order_id     text,
    provider_payment_id   text,
    amount_paise          bigint not null,
    method                payment_method,
    status                payment_status not null default 'CREATED',
    paid_at               timestamptz,
    created_at            timestamptz not null default now(),
    updated_at            timestamptz not null default now()
);

create trigger trg_set_updated_at
    before update on payments
    for each row execute function set_updated_at();

-- PRD §11.2 PAYMENT_SPLITS
create table payment_splits (
    id                          uuid primary key default gen_random_uuid(),
    payment_id                  uuid not null unique references payments(id) on delete cascade,
    worker_amount_paise         bigint not null,
    society_commission_paise    bigint not null,
    welfare_amount_paise        bigint not null,
    platform_fee_paise          bigint not null,
    calculation_snapshot        jsonb not null,
    created_at                  timestamptz not null default now(),
    updated_at                  timestamptz not null default now()
);

create trigger trg_set_updated_at
    before update on payment_splits
    for each row execute function set_updated_at();

-- PRD §11.2 INVOICES
create table invoices (
    id           uuid primary key default gen_random_uuid(),
    booking_id   uuid not null unique references bookings(id),
    invoice_no   varchar(50) not null unique,
    pdf_path     text,
    issued_at    timestamptz not null default now(),
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

create trigger trg_set_updated_at
    before update on invoices
    for each row execute function set_updated_at();
