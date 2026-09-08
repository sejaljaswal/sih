-- Realizes the ER diagram's USERS entity (PRD §11.2). Auth itself — email/password
-- hashing, sessions — is Supabase Auth's job (ARCHITECTURE-V2 §2.1), so this table
-- drops USERS.password_hash and instead mirrors auth.users(id) 1:1. `role`,
-- `society_id` and `federation_id` are also copied into auth.jwt() app_metadata at
-- signup so middleware and RLS can read them without a DB round trip.
create table profiles (
    id                  uuid primary key references auth.users(id) on delete cascade,
    phone               varchar(15) not null unique,
    email               text,
    full_name           text not null,
    role                user_role not null,
    preferred_language  varchar(2) not null default 'hi' check (preferred_language in ('en','hi','pa')),
    society_id          uuid references societies(id),
    federation_id       uuid references federations(id),
    is_active           boolean not null default true,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now(),
    deleted_at          timestamptz
);

create index idx_profiles_society    ON profiles (society_id) where deleted_at is null;
create index idx_profiles_federation ON profiles (federation_id) where deleted_at is null;
create index idx_profiles_role       ON profiles (role) where deleted_at is null;

create trigger trg_set_updated_at
    before update on profiles
    for each row execute function set_updated_at();
